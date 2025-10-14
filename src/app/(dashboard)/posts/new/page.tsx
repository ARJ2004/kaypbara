'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'

const postFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500).optional(),
  categoryIds: z.array(z.string().uuid(), { required_error: 'Select at least one category' }).default([]),
  published: z.boolean().default(false),
})

type PostFormData = z.infer<typeof postFormSchema>

export default function NewPostPage() {
  const router = useRouter()

  const { data: categories, isLoading: isLoadingCategories } = trpc.category.getAll.useQuery()

  const utils = trpc.useUtils()
  const createPost = trpc.post.create.useMutation({
    onSuccess: async (post) => {
      await utils.post.getAll.invalidate()
      router.push(`/posts/${post.slug}`)
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      categoryIds: [],
      published: false,
    },
  })

  const selectedCategoryIds = watch('categoryIds')

  const toggleCategory = useCallback(
    (categoryId: string) => {
      const current = new Set(selectedCategoryIds ?? [])
      if (current.has(categoryId)) {
        current.delete(categoryId)
      } else {
        current.add(categoryId)
      }
      setValue('categoryIds', Array.from(current), { shouldValidate: true })
    },
    [selectedCategoryIds, setValue]
  )

  const submitWithStatus = (published: boolean) =>
    handleSubmit((data) => {
      createPost.mutate({
        title: data.title.trim(),
        content: data.content,
        excerpt: data.excerpt?.trim() || undefined,
        categoryIds: data.categoryIds,
        published,
      })
    })()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/posts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create a New Post</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Share your thoughts with the world</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Post Title</Label>
                  <Input id="title" placeholder="Enter a catchy title" {...register('title')} />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <div className="rounded-lg border">
                    <div className="flex items-center gap-1 border-b px-2 py-1 text-gray-500">
                      <Button type="button" variant="ghost" size="icon" aria-label="Bold">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" aria-label="Italic">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" aria-label="Underline">
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" aria-label="Link">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" aria-label="Image">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      id="content"
                      placeholder="Start writing your masterpiece..."
                      rows={14}
                      className="border-0 focus-visible:ring-0"
                      {...register('content')}
                    />
                  </div>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt (optional)</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Short summary shown in lists"
                    rows={3}
                    {...register('excerpt')}
                  />
                  {errors.excerpt && (
                    <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
              <CardDescription>Choose categories and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Categories</Label>
                <div className="mt-3 space-y-2">
                  {isLoadingCategories && (
                    <div className="text-sm text-gray-500">Loading categories...</div>
                  )}
                  {!isLoadingCategories && categories && categories.length === 0 && (
                    <div className="text-sm text-gray-500">No categories yet</div>
                  )}
                  {!isLoadingCategories && categories && categories.length > 0 && (
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={selectedCategoryIds?.includes(category.id) || false}
                            onChange={() => toggleCategory(category.id)}
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.categoryIds && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryIds.message as string}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => submitWithStatus(true)}
                  disabled={createPost.isPending}
                >
                  {createPost.isPending ? 'Publishing...' : 'Publish Post'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => submitWithStatus(false)}
                  disabled={createPost.isPending}
                >
                  {createPost.isPending ? 'Saving...' : 'Save as Draft'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
