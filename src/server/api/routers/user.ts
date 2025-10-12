import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { users, insertUserSchema } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

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
    .input(insertUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { data: { user } } = await ctx.supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Check if user exists
      const existingUser = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1)

      if (existingUser.length > 0) {
        // Update existing user
        const [updatedUser] = await ctx.db
          .update(users)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))
          .returning()

        return updatedUser
      } else {
        // Create new user
        const [newUser] = await ctx.db
          .insert(users)
          .values({
            id: user.id,
            email: user.email!,
            fullName: user.user_metadata?.full_name || null,
            avatarUrl: user.user_metadata?.avatar_url || null,
          })
          .returning()

        return newUser
      }
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
