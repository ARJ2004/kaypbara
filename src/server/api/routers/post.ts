import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
// Removed global db import; use ctx.db for request-scoped DB
import { posts, postCategories } from '../../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { createPostSchema, updatePostSchema, getPostsSchema, getPostBySlugSchema } from '../../lib/validators';
import { slugify } from '../../lib/slugify';
import { ensureUserInDatabase } from '@/lib/auth-utils';
import { TRPCError } from '@trpc/server';

export const postRouter = router({
  getAll: publicProcedure
    .input(getPostsSchema)
    .query(async ({ input, ctx }) => {
      const { published, categoryId, authorId, limit } = input;
      
      const conditions = [];
      
      if (published !== undefined) {
        conditions.push(eq(posts.published, published));
      }

      if (authorId) {
        conditions.push(eq(posts.authorId, authorId));
      }

      if (categoryId) {
        return await ctx.db
          .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            content: posts.content,
            excerpt: posts.excerpt,
            imageUrl: posts.imageUrl,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .innerJoin(postCategories, eq(posts.id, postCategories.postId))
          .where(and(...conditions, eq(postCategories.categoryId, categoryId)))
          .orderBy(desc(posts.createdAt))
          .limit(limit);
      }

      return await ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          imageUrl: posts.imageUrl,
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(posts.createdAt))
        .limit(limit);
    }),

  getBySlug: publicProcedure
    .input(getPostBySlugSchema)
    .query(async ({ input, ctx }) => {
      const { slug } = input;
      
      const result = await ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          imageUrl: posts.imageUrl,
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);

      return result[0] || null;
    }),

  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, content, excerpt, imageUrl, published, categoryIds } = input;
      const slug = slugify(title);

      // Ensure author exists in our local users table (FK constraint)
      try {
        await ensureUserInDatabase(ctx.user);
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to ensure user', cause: error });
      }

      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          title,
          slug,
          content,
          excerpt,
          imageUrl: imageUrl || null,
          published,
          authorId: ctx.user.id,
        })
        .returning();

      // Create category relationships
      if (categoryIds.length > 0) {
        await ctx.db.insert(postCategories).values(
          categoryIds.map(categoryId => ({
            postId: newPost.id,
            categoryId,
          }))
        );
      }

      return newPost;
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, title, content, excerpt, imageUrl, published, categoryIds } = input;
      
      const updateData: any = {};
      if (title) {
        updateData.title = title;
        updateData.slug = slugify(title);
      }
      if (content) updateData.content = content;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
      if (published !== undefined) updateData.published = published;
      updateData.updatedAt = new Date();

      const [updatedPost] = await ctx.db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, id))
        .returning();

      // Update category relationships if provided
      if (categoryIds) {
        // Delete existing relationships
        await ctx.db
          .delete(postCategories)
          .where(eq(postCategories.postId, id));

        // Create new relationships
        if (categoryIds.length > 0) {
          await ctx.db.insert(postCategories).values(
            categoryIds.map(categoryId => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      
      // Delete category relationships first (cascade should handle this, but being explicit)
      await ctx.db
        .delete(postCategories)
        .where(eq(postCategories.postId, id));

      // Delete the post
      await ctx.db
        .delete(posts)
        .where(eq(posts.id, id));

      return { success: true };
    }),
});
