import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../../db';
import { categories, postCategories } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { createCategorySchema, updateCategorySchema } from '../../lib/validators';
import { slugify } from '../../lib/slugify';

export const categoryRouter = router({
  getAll: publicProcedure
    .query(async () => {
      return await db
        .select()
        .from(categories)
        .orderBy(desc(categories.createdAt));
    }),

  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      const { name, description } = input;
      const slug = slugify(name);

      const [newCategory] = await db
        .insert(categories)
        .values({
          name,
          slug,
          description,
        })
        .returning();

      return newCategory;
    }),

  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, name, description } = input;
      
      const updateData: any = {};
      if (name) {
        updateData.name = name;
        updateData.slug = slugify(name);
      }
      if (description !== undefined) updateData.description = description;
      updateData.updatedAt = new Date();

      const [updatedCategory] = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();

      return updatedCategory;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { id } = input;
      
      // Check if category has any posts
      const existingRelations = await db
        .select()
        .from(postCategories)
        .where(eq(postCategories.categoryId, id))
        .limit(1);

      if (existingRelations.length > 0) {
        throw new Error('Cannot delete category with assigned posts');
      }

      await db
        .delete(categories)
        .where(eq(categories.id, id));

      return { success: true };
    }),
});
