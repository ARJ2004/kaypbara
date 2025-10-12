'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';

export default function PostsPage() {
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  
  const { data: posts, isLoading, error } = trpc.post.getAll.useQuery({
    published: filter === 'all' ? undefined : filter === 'published',
    limit: 50,
  });

  const deletePost = trpc.post.delete.useMutation();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost.mutateAsync({ id });
        // The query will automatically refetch due to React Query
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <Link href="/posts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
        <div className="text-center py-8">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <Link href="/posts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
        <div className="text-center py-8 text-red-600">
          Error loading posts: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <Link href="/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['all', 'published', 'drafts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {post.excerpt || 'No excerpt available'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Updated {new Date(post.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/posts/${post.slug}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/posts/${post.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first blog post.
            </p>
            <Link href="/posts/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
