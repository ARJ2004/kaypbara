'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = trpc.post.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/posts">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/posts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Published {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.updatedAt !== post.createdAt && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Published on {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <Link href="/posts">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Posts
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
