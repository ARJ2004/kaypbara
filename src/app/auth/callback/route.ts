import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user exists in our database
        try {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.id, user.id))
            .limit(1)

          // If user doesn't exist in our database, create them
          if (existingUser.length === 0) {
            await db.insert(users).values({
              id: user.id,
              email: user.email!,
              fullName: user.user_metadata?.full_name || null,
              avatarUrl: user.user_metadata?.avatar_url || null,
            })
          }
        } catch (dbError) {
          console.error('Error ensuring user exists in database:', dbError)
          // Continue with redirect even if user creation fails
          // The user can still use the app, and we can retry later
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
