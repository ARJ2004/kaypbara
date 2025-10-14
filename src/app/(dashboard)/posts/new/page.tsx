'use client'

import { useCallback, useRef, useState } from 'react'
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
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'

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
  const [submitError, setSubmitError] = useState<string | null>(null)
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false)
  // Always-on live preview; no toggle

  const { data: categories, isLoading: isLoadingCategories } = trpc.category.getAll.useQuery()

  const utils = trpc.useUtils()
  const createPost = trpc.post.create.useMutation({
    onSuccess: async (post) => {
      setSubmitError(null)
      await utils.post.getAll.invalidate()
      router.push(`/posts/${post.slug}`)
    },
    onError: (error) => {
      setSubmitError(error.message || 'Failed to create post')
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
  const contentValue = watch('content')

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

  const onSubmit = (data: PostFormData, event?: any) => {
    const submitterValue: string | undefined = event?.nativeEvent?.submitter?.value
    const publish = submitterValue === 'publish'
    createPost.mutate({
      title: data.title.trim(),
      content: data.content,
      excerpt: data.excerpt?.trim() || undefined,
      categoryIds: data.categoryIds,
      published: publish,
    })
  }

  const applyWrap = (before: string, after: string, placeholder: string) => {
    const el = contentRef.current
    const value = contentValue || ''
    if (!el) {
      setValue('content', `${value}${before}${placeholder}${after}`, { shouldValidate: true })
      return
    }
    const start = el.selectionStart ?? value.length
    const end = el.selectionEnd ?? value.length
    const selected = value.slice(start, end) || placeholder
    const newText = value.slice(0, start) + before + selected + after + value.slice(end)
    const newStart = start + before.length
    const newEnd = newStart + selected.length
    setValue('content', newText, { shouldValidate: true })
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(newStart, newEnd)
    })
  }

  const handleBold = () => applyWrap('**', '**', 'bold text')
  const handleItalic = () => applyWrap('*', '*', 'italic text')
  const handleUnderline = () => applyWrap('<u>', '</u>', 'underlined text')
  const handleLink = () => {
    const url = typeof window !== 'undefined' ? window.prompt('Enter URL') : ''
    if (!url) return
    const el = contentRef.current
    const value = contentValue || ''
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const selected = value.slice(start, end) || 'link text'
    const before = '['
    const middle = selected
    const after = `](${url})`
    const newText = value.slice(0, start) + before + middle + after + value.slice(end)
    const newStart = start + before.length
    const newEnd = newStart + middle.length
    setValue('content', newText, { shouldValidate: true })
    if (el) {
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(newStart, newEnd)
      })
    }
  }
  const handleImage = () => {
    fileInputRef.current?.click()
  }

  const insertAtSelection = (insertion: string) => {
    const el = contentRef.current
    const value = contentValue || ''
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const newText = value.slice(0, start) + insertion + value.slice(end)
    const caret = start + insertion.length
    setValue('content', newText, { shouldValidate: true })
    if (el) {
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(caret, caret)
      })
    }
  }

  const onImageFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setIsUploadingImage(true)
      const supabase = createSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSubmitError('Please sign in to upload images')
        // Optionally navigate to login
        // router.push('/login')
        return
      }
      const userId = user.id
      const filePath = `${userId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file, { upsert: true, contentType: file.type })
      if (uploadError) {
        setSubmitError(uploadError.message || 'Failed to upload image')
        return
      }
      const { data: publicData } = supabase.storage.from('post-images').getPublicUrl(filePath)
      const publicUrl = publicData?.publicUrl
      if (!publicUrl) {
        setSubmitError('Failed to get image URL')
        return
      }
      const alt = typeof window !== 'undefined' ? window.prompt('Enter alt text (optional)') || '' : ''
      const insertion = `![${alt}](${publicUrl})`
      insertAtSelection(insertion)
    } catch (err: any) {
      setSubmitError(err?.message || 'Image upload failed')
    } finally {
      setIsUploadingImage(false)
    }
  }

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

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}
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
                      <Button type="button" onClick={handleBold} variant="ghost" size="icon" aria-label="Bold">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button type="button" onClick={handleItalic} variant="ghost" size="icon" aria-label="Italic">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button type="button" onClick={handleUnderline} variant="ghost" size="icon" aria-label="Underline">
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Button type="button" onClick={handleLink} variant="ghost" size="icon" aria-label="Link">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button type="button" onClick={handleImage} variant="ghost" size="icon" aria-label="Image" disabled={isUploadingImage}>
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={onImageFileChange} />
                      <div className="ml-auto text-xs text-gray-500 select-none pr-2">Live preview</div>
                    </div>
                    <Textarea
                      id="content"
                      placeholder="Start writing your masterpiece..."
                      rows={14}
                      className="border-0 focus-visible:ring-0"
                      {...(() => {
                        const { ref, ...rest } = register('content')
                        return {
                          ...rest,
                          ref: (el: HTMLTextAreaElement) => {
                            contentRef.current = el
                            if (typeof ref === 'function') {
                              ref(el)
                            } else if (ref) {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (ref as any).current = el
                            }
                          },
                        }
                      })()}
                    />
                    <div className="border-t p-3 bg-white">
                      <div className="prose prose-sm sm:prose max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[
                            rehypeRaw,
                            [
                              rehypeSanitize,
                              {
                                ...defaultSchema,
                                tagNames: [...(defaultSchema.tagNames || []), 'u'],
                                attributes: {
                                  ...(defaultSchema.attributes || {}),
                                  a: ['href', 'title', 'target', 'rel'],
                                  img: ['src', 'alt', 'title', 'width', 'height'],
                                },
                              },
                            ],
                          ]}
                        >
                          {contentValue || ''}
                        </ReactMarkdown>
                      </div>
                    </div>
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
                <Button type="submit" value="publish" name="intent" disabled={createPost.isPending}>
                  {createPost.isPending ? 'Publishing...' : 'Publish Post'}
                </Button>
                <Button type="submit" value="draft" name="intent" variant="outline" disabled={createPost.isPending}>
                  {createPost.isPending ? 'Saving...' : 'Save as Draft'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
