import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Tag, TrendingUp } from 'lucide-react'
import { appRouter } from '@/server/api/root'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/server/db'

export default async function DashboardPage() {
  // Create server-side tRPC caller
  const supabase = await createClient();
  
  // First, verify the user session is available
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // Initialize default stats
  let stats = {
    totalPosts: 0,
    publishedPosts: 0,
    categories: 0,
  };

  // Only fetch stats if user is authenticated
  if (user && !authError) {
    try {
      const caller = appRouter.createCaller({ db, supabase });
      stats = await caller.user.getDashboardStats();
    } catch (error) {
      // If error occurs, use default values and log detailed error
      console.error('Error fetching dashboard stats:', error);
      
      // Check if it's a database connection error
      if (error instanceof Error && error.message.includes('ENOTFOUND')) {
        console.error('Database connection failed - check your network connection and Supabase configuration');
      } else if (error instanceof Error && error.message.includes('Failed query')) {
        console.error('Database query failed - check your database schema and permissions');
      }
    }
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your blogging dashboard</p>
        </div>
        <Link href="/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPosts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/posts/new">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" className="w-full justify-start">
                <Tag className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest blog activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to set up your blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium">Create your first category</h4>
                <p className="text-sm text-muted-foreground">
                  Organize your posts with categories
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium">Write your first post</h4>
                <p className="text-sm text-muted-foreground">
                  Start sharing your thoughts with the world
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium">Publish and share</h4>
                <p className="text-sm text-muted-foreground">
                  Make your content public and shareable
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
