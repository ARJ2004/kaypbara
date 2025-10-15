import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { ensureUserInDatabase } from '@/lib/auth-utils'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('Auth callback called with code:', !!code)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Auth exchange successful')
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        console.log('User found:', user.id, user.email)
        try {
          // Ensure user exists in our database
          const dbUser = await ensureUserInDatabase(user)
          console.log('User ensured in database:', dbUser?.id)
        } catch (dbError) {
          console.error('Error ensuring user exists in database:', dbError)
          // Continue with redirect even if user creation fails
          // The user can still use the app, and we can retry later
        }
      } else {
        console.log('No user found after auth exchange')
      }

      // Revalidate the dashboard path to ensure fresh data
      revalidatePath('/dashboard')
      
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
    } else {
      console.error('Auth exchange error:', error)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
