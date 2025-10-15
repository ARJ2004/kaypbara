import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { users, insertUserSchema, posts, postCategories } from '@/server/db/schema'
import { eq, and, sql, countDistinct } from 'drizzle-orm'
import { ensureUserInDatabase } from '@/lib/auth-utils'

export const userRouter = router({
  // Get current user
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const { data: { user } } = await ctx.supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not found')
    }

    // Get user from our database
    const dbUser = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    return dbUser[0] || null
  }),

  // Create or update user
  upsertUser: publicProcedure
    .input(insertUserSchema.optional())
    .mutation(async ({ ctx, input }) => {
      const { data: { user } } = await ctx.supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Use the utility function to ensure user exists
      return await ensureUserInDatabase(user)
    }),

  // Get user by ID
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1)

      return user[0] || null
    }),

  // Get dashboard stats for the current user
  getDashboardStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      // Get total posts count
      const totalPostsResult = await ctx.db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(eq(posts.authorId, userId));
      const totalPosts = totalPostsResult[0]?.count || 0;

      // Get published posts count
      const publishedPostsResult = await ctx.db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(and(eq(posts.authorId, userId), eq(posts.published, true)));
      const publishedPosts = publishedPostsResult[0]?.count || 0;

      // Get unique categories count used in user's posts
      const categoriesResult = await ctx.db
        .select({ count: countDistinct(postCategories.categoryId) })
        .from(posts)
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .where(eq(posts.authorId, userId));
      const categories = Number(categoriesResult[0]?.count || 0);

      return {
        totalPosts,
        publishedPosts,
        categories,
      };
    }),
})
