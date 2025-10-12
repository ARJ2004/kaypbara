import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { users, insertUserSchema } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
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
})
