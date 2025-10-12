# Blogging Platform - Cursor AI Rules

## Project Overview
Multi-user blogging platform built with Next.js 15, tRPC, Drizzle ORM, and Supabase PostgreSQL.

---

## Core Technology Stack

### Framework & Runtime
- **Next.js 15** with App Router (React Server Components + Client Components)
- **React 18+** with TypeScript 5+ (strict mode)
- **Node.js 18+**

### Backend & API Layer
- **tRPC v11** - Type-safe API procedures (no REST endpoints)
- **Drizzle ORM** - Type-safe database queries and schema
- **Zod** - Runtime validation for all inputs
- **Supabase PostgreSQL** - Database hosting

### State Management
- **TanStack Query (React Query)** - Server state (via tRPC integration)
- **Zustand** - Client-side global state (UI state only)
- **React Hook Form** - Form state management

### Styling & UI
- **Tailwind CSS** - Utility-first styling (no custom CSS files)
- **shadcn/ui** - Pre-built accessible components
- **Lucide React** - Icon library

### Content Editor
- **Markdown** - `react-markdown` + `remark-gfm` (NOT rich text editor)

---

## Critical Rules (ALWAYS FOLLOW)

### 1. Type Safety
✅ **DO:**
- Use TypeScript for ALL files (`.ts`, `.tsx`)
- Leverage tRPC's automatic type inference
- Define Zod schemas for all API inputs
- Use Drizzle's type-safe query builders
- Export and import types from tRPC router: `type RouterOutput = inferRouterOutputs<AppRouter>`

❌ **DON'T:**
- Use `any` type (use `unknown` if necessary)
- Use `@ts-ignore` or `@ts-nocheck`
- Skip input validation with Zod
- Use raw SQL queries (use Drizzle)

### 2. File Organization
```
src/
├── app/                    # Next.js App Router ONLY
│   ├── (marketing)/       # Route groups with parentheses
│   ├── (dashboard)/
│   ├── api/trpc/[trpc]/   # tRPC handler
│   └── layout.tsx
├── server/                 # Backend logic ONLY
│   ├── db/
│   │   ├── index.ts       # Drizzle client export
│   │   └── schema.ts      # All database tables
│   └── api/
│       ├── trpc.ts        # tRPC context & initialization
│       ├── root.ts        # Root router
│       └── routers/       # Feature-based routers
├── lib/                    # Shared utilities
│   └── trpc/              # tRPC client setup
├── components/             # React components
│   ├── ui/                # shadcn/ui only
│   └── [feature]/         # Feature-based organization
├── hooks/                  # Custom React hooks
├── store/                  # Zustand stores
└── types/                  # Shared TypeScript types
```

### 3. Component Architecture

#### Server Components (Default)
✅ **Use for:**
- Layouts and static pages
- Data fetching at page level
- SEO-critical content
- Non-interactive sections

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  // Can fetch data directly here if needed
  return <PostsList />;
}
```

#### Client Components (Explicit)
✅ **Use for:**
- Forms and interactive elements
- State management (useState, useReducer)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage - NEVER USE, window, document)
- tRPC hooks (useQuery, useMutation)

```tsx
'use client'; // REQUIRED at top

import { trpc } from '@/lib/trpc/client';

export function PostForm() {
  const { mutate } = trpc.post.create.useMutation();
  // ...
}
```

### 4. tRPC Patterns

#### Server-Side (Procedures)
```typescript
// server/api/routers/post.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '@/server/db';
import { posts } from '@/server/db/schema';

export const postRouter = router({
  // QUERY for reads
  getAll: publicProcedure
    .input(z.object({
      published: z.boolean().optional(),
      categoryId: z.string().uuid().optional(),
    }))
    .query(async ({ input }) => {
      return await db.query.posts.findMany({
        where: input.published ? eq(posts.published, true) : undefined,
        with: { postCategories: { with: { category: true } } },
      });
    }),

  // MUTATION for writes
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1),
      categoryIds: z.array(z.string().uuid()),
    }))
    .mutation(async ({ input }) => {
      const slug = slugify(input.title);
      const [post] = await db.insert(posts).values({
        ...input,
        slug,
      }).returning();
      
      // Handle many-to-many relationships
      if (input.categoryIds.length > 0) {
        await db.insert(postCategories).values(
          input.categoryIds.map(catId => ({
            postId: post.id,
            categoryId: catId,
          }))
        );
      }
      
      return post;
    }),
});
```

#### Client-Side (Hooks)
```typescript
'use client';

// QUERY - For reading data
const { data, isLoading, error } = trpc.post.getAll.useQuery({
  published: true,
});

// MUTATION - For writing data
const utils = trpc.useUtils();
const { mutate, isPending } = trpc.post.create.useMutation({
  onSuccess: () => {
    utils.post.getAll.invalidate(); // Refresh cache
    toast.success('Post created!');
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

// Optimistic update example
const { mutate: deletePost } = trpc.post.delete.useMutation({
  onMutate: async ({ id }) => {
    await utils.post.getAll.cancel();
    const previousPosts = utils.post.getAll.getData();
    
    utils.post.getAll.setData(
      undefined,
      (old) => old?.filter(p => p.id !== id)
    );
    
    return { previousPosts };
  },
  onError: (err, variables, context) => {
    utils.post.getAll.setData(undefined, context?.previousPosts);
  },
  onSettled: () => {
    utils.post.getAll.invalidate();
  },
});
```

### 5. Database Patterns (Drizzle)

#### Schema Definition
```typescript
// server/db/schema.ts
import { pgTable, text, boolean, timestamp, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ALWAYS define relations for type-safe joins
export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
}));
```

#### Querying Patterns
```typescript
// ✅ CORRECT - Use Drizzle Query API
const posts = await db.query.posts.findMany({
  where: eq(posts.published, true),
  with: {
    postCategories: {
      with: { category: true }
    }
  },
  orderBy: desc(posts.createdAt),
});

// ✅ CORRECT - Use query builder for complex queries
const posts = await db
  .select()
  .from(posts)
  .leftJoin(postCategories, eq(posts.id, postCategories.postId))
  .leftJoin(categories, eq(postCategories.categoryId, categories.id))
  .where(eq(posts.published, true));

// ❌ WRONG - Don't use raw SQL
const posts = await db.execute(sql`SELECT * FROM posts`);
```

### 6. State Management Rules

#### React Query (via tRPC)
✅ **Use for:**
- All server data (posts, categories)
- Caching API responses
- Loading/error states
- Optimistic updates

```typescript
// Configure in tRPC provider
<TRPCReactProvider>
  {children}
</TRPCReactProvider>

// Default config in lib/trpc/client.ts
queryClient: new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
}),
```

#### Zustand
✅ **Use for:**
- UI state (modals, drawers, theme)
- Non-persisted global state
- Toast notifications

```typescript
// store/ui-store.ts
import { create } from 'zustand';

interface UIStore {
  isDeleteModalOpen: boolean;
  postToDelete: string | null;
  openDeleteModal: (postId: string) => void;
  closeDeleteModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isDeleteModalOpen: false,
  postToDelete: null,
  openDeleteModal: (postId) => set({ isDeleteModalOpen: true, postToDelete: postId }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, postToDelete: null }),
}));
```

❌ **DON'T use for:**
- Server data (use tRPC/React Query)
- Form state (use React Hook Form)
- Persisted data (NO localStorage/sessionStorage)

### 7. Form Handling

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  categoryIds: z.array(z.string()),
  published: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

export function PostForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const { mutate, isPending } = trpc.post.create.useMutation();

  const onSubmit = (data: PostFormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      {/* ... */}
    </form>
  );
}
```

### 8. Error Handling

#### Server-Side (tRPC)
```typescript
import { TRPCError } from '@trpc/server';

export const postRouter = router({
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      try {
        // Check for duplicate slug
        const existing = await db.query.posts.findFirst({
          where: eq(posts.slug, slugify(input.title)),
        });
        
        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A post with this title already exists',
          });
        }
        
        return await db.insert(posts).values(input);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create post',
          cause: error,
        });
      }
    }),
});
```

#### Client-Side
```typescript
const { mutate } = trpc.post.create.useMutation({
  onError: (error) => {
    // tRPC errors are typed
    if (error.data?.code === 'CONFLICT') {
      toast.error('Post with this title already exists');
    } else {
      toast.error('Something went wrong');
    }
  },
});
```

### 9. Styling Guidelines

#### Tailwind Best Practices
✅ **DO:**
- Use Tailwind utility classes directly in JSX
- Use `cn()` helper from `lib/utils.ts` for conditional classes
- Use shadcn/ui components for complex UI elements
- Follow mobile-first responsive design

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "rounded-lg border p-6",
  isActive && "bg-blue-50 border-blue-200",
  "hover:shadow-md transition-shadow"
)}>
```

❌ **DON'T:**
- Create custom CSS files
- Use inline styles (except for dynamic values)
- Override shadcn/ui component styles excessively

#### Component Styling Pattern
```tsx
// components/posts/post-card.tsx
export function PostCard({ post, variant = 'default' }: PostCardProps) {
  return (
    <article className={cn(
      "group rounded-lg border bg-card p-6 transition-all",
      "hover:shadow-lg hover:border-primary/50",
      variant === 'featured' && "border-primary bg-primary/5"
    )}>
      <h3 className="text-xl font-semibold group-hover:text-primary">
        {post.title}
      </h3>
    </article>
  );
}
```

### 10. Naming Conventions

#### Files
- **Components**: `kebab-case.tsx` (e.g., `post-card.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `slugify.ts`)
- **Types**: `kebab-case.ts` or `index.ts` (e.g., `types/index.ts`)
- **API Routes**: `route.ts` (Next.js convention)

#### Code
```typescript
// Components: PascalCase
export function PostCard() {}

// Functions: camelCase
export function slugify() {}

// Constants: SCREAMING_SNAKE_CASE
export const MAX_POST_TITLE_LENGTH = 200;

// Types/Interfaces: PascalCase
export interface PostFormData {}
export type PostStatus = 'draft' | 'published';

// Zod Schemas: camelCase + 'Schema' suffix
export const createPostSchema = z.object({});

// tRPC Routers: camelCase + 'Router' suffix
export const postRouter = router({});
```

#### Database
- **Tables**: `snake_case`, plural (e.g., `posts`, `categories`)
- **Columns**: `snake_case` or `camelCase` (Drizzle converts)
- **Junction tables**: `singular_singular` (e.g., `post_categories`)

### 11. Import Order
```typescript
// 1. React and Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. External libraries
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// 3. Internal aliases (@/)
import { trpc } from '@/lib/trpc/client';
import { PostCard } from '@/components/posts/post-card';
import { Button } from '@/components/ui/button';

// 4. Relative imports
import { slugify } from '../utils/slugify';

// 5. Types
import type { Post } from '@/types';

// 6. Styles (if any)
import './styles.css';
```

---

## Feature-Specific Rules

### Posts Feature

#### Slug Generation
```typescript
// lib/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ALWAYS check for duplicate slugs
// Add numeric suffix if exists: "my-post" -> "my-post-2"
```

#### Post Status
```typescript
// Use boolean for simplicity (not enum)
published: boolean; // true = published, false = draft

// Filter in queries
const posts = await db.query.posts.findMany({
  where: eq(posts.published, true),
});
```

### Categories Feature

#### Many-to-Many Relationships
```typescript
// ALWAYS use junction table pattern
// server/db/schema.ts

export const postCategories = pgTable('post_categories', {
  postId: uuid('post_id').notNull().references(() => posts.id, { 
    onDelete: 'cascade' 
  }),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { 
    onDelete: 'cascade' 
  }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.categoryId] }),
}));

// Query with relationships
const post = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    postCategories: {
      with: { category: true }
    }
  }
});

// Access categories
const categories = post.postCategories.map(pc => pc.category);
```

### Markdown Editor

```typescript
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownEditor({ value, onChange }) {
  const [preview, setPreview] = useState(false);

  return (
    <div>
      {preview ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {value}
        </ReactMarkdown>
      ) : (
        <textarea value={value} onChange={onChange} />
      )}
      <button onClick={() => setPreview(!preview)}>
        {preview ? 'Edit' : 'Preview'}
      </button>
    </div>
  );
}
```

---

## Performance Rules

### 1. Data Fetching
```typescript
// ✅ GOOD - Prefetch on hover
<Link 
  href={`/posts/${post.slug}`}
  onMouseEnter={() => {
    trpc.post.getBySlug.prefetch({ slug: post.slug });
  }}
>
```

### 2. Images
```tsx
// ALWAYS use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // for above-fold images
/>
```

### 3. Dynamic Imports
```typescript
// For heavy components
import dynamic from 'next/dynamic';

const MarkdownEditor = dynamic(
  () => import('@/components/editor/markdown-editor'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);
```

---

## Security Rules

### 1. Input Validation
```typescript
// ALWAYS validate on server with Zod
// NEVER trust client input

export const postRouter = router({
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1).max(200).trim(),
      content: z.string().min(1).trim(),
      // Sanitize if needed
    }))
    .mutation(async ({ input }) => {
      // Input is validated and typed
    }),
});
```

### 2. SQL Injection Prevention
```typescript
// ✅ SAFE - Drizzle parameterizes queries
await db.query.posts.findFirst({
  where: eq(posts.slug, userInput), // Safe
});

// ❌ UNSAFE - Never use raw SQL with user input
await db.execute(sql`SELECT * FROM posts WHERE slug = ${userInput}`);
```

---

## Testing Guidelines (Optional)

### Unit Tests
```typescript
// utils/slugify.test.ts
import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('converts text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
});
```

---

## Environment Variables

```bash
# .env.local (NEVER commit)
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# .env.example (commit this)
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Rules:**
- Prefix client-side vars with `NEXT_PUBLIC_`
- Never expose secrets to client
- Document all vars in README

---

## Git Commit Conventions

```
feat: add post creation form
fix: resolve slug generation bug
refactor: improve post card component
docs: update README with setup steps
style: format code with prettier
test: add slugify utility tests
```

---

## Common Pitfalls to Avoid

❌ **Don't:**
1. Use `localStorage` or `sessionStorage` (not needed, use React Query cache)
2. Fetch data in Client Components (use Server Components or tRPC hooks)
3. Mix Server and Client Components incorrectly
4. Skip Zod validation on server
5. Use `any` type
6. Create custom CSS files
7. Ignore TypeScript errors
8. Forget to handle loading/error states
9. Skip optimistic updates for better UX
10. Over-engineer solutions

✅ **Do:**
1. Leverage tRPC's type inference
2. Use Server Components by default
3. Validate all inputs with Zod
4. Handle errors gracefully
5. Use Tailwind utilities
6. Keep components small and focused
7. Document complex logic
8. Test critical paths
9. Use React Query cache effectively
10. Follow the folder structure

---

## Quick Reference Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run db:push            # Push schema to database
npm run db:studio          # Open Drizzle Studio
npm run db:seed            # Seed database

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # TypeScript check
```

---

## When in Doubt

1. **Check the schema reference** (`db-schema-reference.md`)
2. **Follow tRPC official docs** for API patterns
3. **Use Drizzle Query API** for database operations
4. **Leverage TypeScript** - if it compiles, it usually works
5. **Keep it simple** - don't over-engineer

---

## Priority Checklist

### Phase 1: Foundation (Days 1-2)
- [ ] Project setup with all dependencies
- [ ] Database schema with Drizzle
- [ ] tRPC routers (posts, categories)
- [ ] Basic CRUD operations working

### Phase 2: Core Features (Days 3-4)
- [ ] Post listing page
- [ ] Individual post view
- [ ] Post creation form
- [ ] Category management
- [ ] Category filtering

### Phase 3: Polish (Days 5-6)
- [ ] Landing page (3 sections)
- [ ] Dashboard page
- [ ] Loading/error states
- [ ] Mobile responsive
- [ ] Published/draft status

### Phase 4: Deploy (Day 7)
- [ ] Code cleanup
- [ ] README documentation
- [ ] Vercel deployment
- [ ] Final testing

---

**Remember:** Type-safe, clean, maintainable code > feature bloat