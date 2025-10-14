import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function ensureUserInDatabase(user: any) {
  console.log('ensureUserInDatabase called with user:', user?.id, user?.email)
  
  if (!user?.id || !user?.email) {
    throw new Error('Invalid user data')
  }

  try {
    // Check if user exists in our database
    console.log('Checking if user exists in database...')
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    console.log('Existing user query result:', existingUser.length > 0 ? 'found' : 'not found')

    if (existingUser.length === 0) {
      // Create new user
      console.log('Creating new user in database...')
      const [newUser] = await db
        .insert(users)
        .values({
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || null,
          avatarUrl: user.user_metadata?.avatar_url || null,
        })
        .returning()

      console.log('User created in database:', user.id)
      return newUser
    } else {
      // Update existing user with latest metadata
      console.log('Updating existing user in database...')
      const [updatedUser] = await db
        .update(users)
        .set({
          email: user.email,
          fullName: user.user_metadata?.full_name || null,
          avatarUrl: user.user_metadata?.avatar_url || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning()

      console.log('User updated in database:', user.id)
      return updatedUser
    }
  } catch (error) {
    console.error('Error ensuring user exists in database:', error)
    throw error
  }
}
