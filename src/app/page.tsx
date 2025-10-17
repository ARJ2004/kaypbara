import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 sm:px-10 lg:px-40 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">Blogify</h2>
            </div>
            <div className="hidden md:flex flex-1 justify-center gap-8">
              <a className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary" href="#">Home</a>
              <a className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary" href="#features">Features</a>
              <a className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary" href="/feed">Blog</a>
            </div>
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-primary text-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10 transition-colors">
                  <span className="truncate">Login</span>
                </Button>
              </Link>
              <Link href="/login">
                <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity">
                  <span className="truncate">Sign Up</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative parallax-container">
            <div className="parallax-layer parallax-bg"></div>
            <div className="parallax-layer parallax-content px-4 sm:px-10 lg:px-40 flex flex-1 justify-center items-center h-full">
              <div className="layout-content-container flex flex-col max-w-4xl flex-1">
                <div className="flex min-h-[480px] flex-col gap-8 items-center justify-center text-center">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tighter animate-fade-in-up">
                      Your Voice, Your Audience. Create a blog that matters.
                    </h1>
                    <p className="text-gray-200 text-base md:text-lg font-normal leading-normal max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                      Join a community of writers and share your passion with the world. Our platform makes it easy to start, grow, and monetize your blog.
                    </p>
                  </div>
                  <Link href="/login">
                    <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-secondary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                      <span className="truncate">Start Writing for Free</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-background-light dark:bg-background-dark py-20 sm:py-32" id="features">
            <div className="px-4 sm:px-10 lg:px-40 max-w-7xl mx-auto">
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4 text-center">
                  <h2 className="text-text-light dark:text-text-dark text-4xl md:text-5xl font-black leading-tight tracking-tight">
                    Why You'll Love Our Platform
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-normal leading-normal max-w-2xl mx-auto">We provide you with all the tools you need to create a successful blog.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 text-center items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/20">
                    <div className="text-primary bg-primary/10 p-4 rounded-full">
                      <span className="material-symbols-outlined" style={{fontSize: '32px'}}>edit_document</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight">Easy-to-Use Editor</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Our intuitive editor makes it simple to write, format, and publish your posts.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 text-center items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/20">
                    <div className="text-primary bg-primary/10 p-4 rounded-full">
                      <span className="material-symbols-outlined" style={{fontSize: '32px'}}>groups</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight">Collaborate with Others</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Work with other authors and editors to create amazing content together.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 text-center items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/20">
                    <div className="text-primary bg-primary/10 p-4 rounded-full">
                      <span className="material-symbols-outlined" style={{fontSize: '32px'}}>monetization_on</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight">Monetize Your Content</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Earn money from your blog through subscriptions, ads, and affiliate links.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 text-center items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/20">
                    <div className="text-primary bg-primary/10 p-4 rounded-full">
                      <span className="material-symbols-outlined" style={{fontSize: '32px'}}>analytics</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight">Powerful Analytics</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Track your blog's performance and understand your audience with our detailed analytics.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gray-100 dark:bg-gray-900/70 py-20 sm:py-32">
            <div className="px-4 sm:px-10 lg:px-40 max-w-4xl mx-auto">
              <div className="flex flex-col justify-center items-center gap-6 text-center">
                <h2 className="text-text-light dark:text-text-dark text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  Ready to Share Your Story?
                </h2>
                <Link href="/login">
                  <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-secondary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all transform hover:scale-105">
                    <span className="truncate">Sign Up Now</span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 sm:px-10 lg:px-40 max-w-7xl mx-auto py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium" href="#">About Us</a>
                <a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium" href="#">Contact</a>
                <a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium" href="#">Terms of Service</a>
                <a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium" href="#">Privacy Policy</a>
              </div>
              <div className="flex justify-center gap-6">
                <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
                  <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg>
                </a>
                <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
                  <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
                  <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.161 1.043c-1.049.046-1.684.21-2.224.41a3.863 3.863 0 00-1.392.936 3.863 3.863 0 00-.936 1.392c-.2.54-.364 1.175-.41 2.224-.046 1.04-.06 1.353-.06 3.738s.014 2.698.06 3.738c.046 1.049.21 1.684.41 2.224a3.863 3.863 0 00.936 1.392 3.863 3.863 0 001.392.936c.54.2 1.175.364 2.224.41 1.04.046 1.353.06 3.738.06s2.698-.014 3.738-.06c1.049-.046 1.684.21 2.224-.41a3.863 3.863 0 001.392-.936 3.863 3.863 0 00.936-1.392c.2-.54.364 1.175.41-2.224.046-1.04.06-1.353.06-3.738s-.014-2.698-.06-3.738c-.046-1.049-.21-1.684-.41-2.224a3.863 3.863 0 00-.936-1.392 3.863 3.863 0 00-1.392-.936c-.54-.2-1.175-.364-2.224-.41-1.04-.046-1.353-.06-3.738-.06s-2.698.014-3.738.06zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" fillRule="evenodd"></path></svg>
                </a>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">© 2023 Blogify. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
