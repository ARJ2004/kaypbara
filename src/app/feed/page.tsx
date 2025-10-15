'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/client'
import { Category, Post } from '@/server/db/schema'
import Link from 'next/link'

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 4

  const { data: categories } = trpc.category.getAll.useQuery()
  const { data: allPosts } = trpc.post.getAll.useQuery({
    published: true,
    categoryId: selectedCategory || undefined
  })

  // Filter posts based on search query
  const filteredPosts = allPosts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // Calculate pagination
  const totalPages = Math.ceil((filteredPosts?.length || 0) / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const displayedPosts = filteredPosts?.slice(startIndex, startIndex + postsPerPage)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-b-[#233648] px-10 py-3 sticky top-0 bg-background-light dark:bg-background-dark z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-gray-800 dark:text-white">
              <div className="size-4">
                <svg className="text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-gray-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">MyBlog</h2>
            </div>
            <div className="flex items-center gap-9">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
                Home
              </Link>
              <Link href="/feed" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
                Feed
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
                About
              </Link>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-4">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-gray-400 dark:text-[#92adc9] flex border border-gray-300 dark:border-[#233648] bg-white dark:bg-[#233648] items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <Input
                  className="rounded-l-none border-l-0 pl-2"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
            <div className="flex gap-2">
              <Link href="/login">
                <Button className="min-w-[84px]">Sign In</Button>
              </Link>
              <Button
                variant="secondary"
                className="min-w-0 px-2.5"
                onClick={() => document.documentElement.classList.toggle('dark')}
              >
                <span className="material-symbols-outlined">dark_mode</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                Blog Posts
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-3 p-3 flex-wrap pr-4 border-b border-gray-200 dark:border-b-[#233648] mb-6">
              <div
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg ${
                  !selectedCategory
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-[#233648] text-gray-800 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30'
                } pl-4 pr-4 cursor-pointer transition-colors`}
                onClick={() => setSelectedCategory(null)}
              >
                <p className="text-sm font-medium leading-normal">All</p>
              </div>
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-[#233648] text-gray-800 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30'
                  } pl-4 pr-4 cursor-pointer transition-colors`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <p className="text-sm font-medium leading-normal">{category.name}</p>
                </div>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
              {displayedPosts?.map((post) => (
                <Link href={`/posts/${post.slug}`} key={post.id}>
                  <Card className="flex flex-col gap-4 bg-white dark:bg-[#1a2b3a] p-4 shadow-md hover:shadow-lg dark:hover:shadow-primary/20 transition-shadow duration-300">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                      style={{
                        backgroundImage: `url("https://source.unsplash.com/random/800x400?${post.title.split(' ').join(',')}")`
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-500 dark:text-[#92adc9] text-sm font-normal leading-normal">
                        Author - {formatDate(post.createdAt)}
                      </p>
                      <p className="text-gray-900 dark:text-white text-xl font-bold leading-tight hover:text-primary dark:hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </p>
                      <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">
                        {post.excerpt || (post.content ? post.content.slice(0, 150) : 'No content available')}...
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8 p-4">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "secondary"}
                  className="h-10 w-10"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
