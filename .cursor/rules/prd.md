Product Requirements Document (PRD)
===================================

Multi-User Blogging Platform
----------------------------

1\. Executive Summary
---------------------

### 1.1 Project Overview

A full-stack, multi-user blogging platform built with modern web technologies, focusing on type-safe development, optimal performance, and maintainable architecture. The platform enables content creation, categorization, and management without authentication requirements.

### 1.2 Timeline & Effort

*   **Duration**: 7 days
    
*   **Estimated Effort**: 12-16 hours
    
*   **Deployment Target**: Vercel (production)
    
*   **Database**: Supabase (PostgreSQL)
    

### 1.3 Success Criteria

*   Fully functional blog CRUD operations
    
*   Type-safe end-to-end implementation
    
*   Clean, maintainable codebase
    
*   Production-ready deployment
    
*   Responsive across devices
    

2\. Technical Architecture
--------------------------

### 2.1 System Architecture Diagram

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌─────────────────────────────────────────────────────────────┐  │                        Client Layer                          │  │  ┌─────────────────────────────────────────────────────┐   │  │  │          Next.js 15 App Router (RSC + Client)       │   │  │  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │  │  │  │   Pages/     │  │  Components  │  │  Zustand  │ │   │  │  │  │   Routes     │  │   (React)    │  │   Store   │ │   │  │  │  └──────────────┘  └──────────────┘  └───────────┘ │   │  │  └─────────────────────────────────────────────────────┘   │  │                           ▲                                  │  │                           │ tRPC Client (Type-Safe)         │  │                           ▼                                  │  │  ┌─────────────────────────────────────────────────────┐   │  │  │              tRPC React Hooks Layer                  │   │  │  │        (Automatic React Query Integration)           │   │  │  └─────────────────────────────────────────────────────┘   │  └─────────────────────────────────────────────────────────────┘                             ▲                             │ HTTP/JSON                             ▼  ┌─────────────────────────────────────────────────────────────┐  │                      API Layer (tRPC)                        │  │  ┌─────────────────────────────────────────────────────┐   │  │  │                  tRPC App Router                     │   │  │  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │   │  │  │  │   Posts    │  │ Categories │  │  Middleware  │  │   │  │  │  │   Router   │  │   Router   │  │ (Validation) │  │   │  │  │  └────────────┘  └────────────┘  └──────────────┘  │   │  │  │                                                      │   │  │  │  ┌─────────────────────────────────────────────┐   │   │  │  │  │         Zod Schema Validation Layer         │   │   │  │  │  └─────────────────────────────────────────────┘   │   │  │  └─────────────────────────────────────────────────────┘   │  └─────────────────────────────────────────────────────────────┘                             ▲                             │ Type-Safe Queries                             ▼  ┌─────────────────────────────────────────────────────────────┐  │                    Data Access Layer                         │  │  ┌─────────────────────────────────────────────────────┐   │  │  │              Drizzle ORM (Type-Safe)                 │   │  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │   │  │  │  │   Schema     │  │   Queries    │  │ Relations│  │   │  │  │  │ Definitions  │  │   & Joins    │  │          │  │   │  │  │  └──────────────┘  └──────────────┘  └──────────┘  │   │  │  └─────────────────────────────────────────────────────┘   │  └─────────────────────────────────────────────────────────────┘                             ▲                             │ SQL Queries                             ▼  ┌─────────────────────────────────────────────────────────────┐  │                    Database Layer                            │  │  ┌─────────────────────────────────────────────────────┐   │  │  │         Supabase PostgreSQL Database                 │   │  │  │                                                       │   │  │  │  ┌──────────┐  ┌────────────┐  ┌─────────────────┐ │   │  │  │  │  posts   │  │ categories │  │ post_categories │ │   │  │  │  │  table   │  │   table    │  │  (junction)     │ │   │  │  │  └──────────┘  └────────────┘  └─────────────────┘ │   │  │  └─────────────────────────────────────────────────────┘   │  └─────────────────────────────────────────────────────────────┘   `

### 2.2 Technology Stack

#### Core Framework

*   **Next.js 15** (App Router, React Server Components)
    
*   **React 18+** (Server & Client Components)
    
*   **TypeScript 5+** (Strict mode)
    

#### Backend & API

*   **tRPC v11** - Type-safe API layer
    
*   **Drizzle ORM** - Type-safe database ORM
    
*   **Zod** - Runtime schema validation
    
*   **Supabase PostgreSQL** - Database hosting
    

#### State Management

*   **React Query (TanStack Query)** - Via tRPC integration
    
*   **Zustand** - Global client state (where needed)
    

#### Styling & UI

*   **Tailwind CSS** - Utility-first styling
    
*   **shadcn/ui** - Pre-built component library
    
*   **Lucide Icons** - Icon system
    

#### Content Editor

*   **Markdown** (Recommended for time efficiency)
    
    *   Libraries: react-markdown, remark-gfm
        
    *   Alternative: Tiptap (if rich text needed)
        

3\. Architecture Patterns & Best Practices
------------------------------------------

### 3.1 Folder Structure

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   src/  ├── app/                          # Next.js App Router  │   ├── (marketing)/             # Marketing pages group  │   │   ├── page.tsx             # Landing page  │   │   └── layout.tsx           # Marketing layout  │   ├── (dashboard)/             # Dashboard group  │   │   ├── dashboard/  │   │   │   └── page.tsx         # Dashboard page  │   │   ├── posts/  │   │   │   ├── page.tsx         # Posts listing  │   │   │   ├── [slug]/  │   │   │   │   └── page.tsx     # Individual post view  │   │   │   ├── new/  │   │   │   │   └── page.tsx     # Create post  │   │   │   └── [id]/edit/  │   │   │       └── page.tsx     # Edit post  │   │   ├── categories/  │   │   │   └── page.tsx         # Category management  │   │   └── layout.tsx           # Dashboard layout  │   ├── api/  │   │   └── trpc/  │   │       └── [trpc]/  │   │           └── route.ts     # tRPC API handler  │   ├── layout.tsx               # Root layout  │   └── globals.css              # Global styles  │  ├── server/                       # Backend logic  │   ├── db/  │   │   ├── index.ts             # Drizzle client  │   │   ├── schema.ts            # Database schema  │   │   └── migrations/          # Database migrations  │   ├── api/  │   │   ├── trpc.ts              # tRPC initialization  │   │   ├── root.ts              # Root router  │   │   └── routers/  │   │       ├── post.ts          # Post procedures  │   │       └── category.ts      # Category procedures  │   └── lib/  │       ├── slugify.ts           # Slug generation  │       └── validators.ts        # Zod schemas  │  ├── lib/                          # Shared utilities  │   ├── trpc/  │   │   ├── client.ts            # tRPC client setup  │   │   └── provider.tsx         # tRPC Provider  │   ├── utils.ts                 # Utility functions  │   └── constants.ts             # App constants  │  ├── components/                   # React components  │   ├── ui/                      # shadcn/ui components  │   ├── posts/  │   │   ├── post-card.tsx  │   │   ├── post-form.tsx  │   │   └── post-list.tsx  │   ├── categories/  │   │   ├── category-badge.tsx  │   │   └── category-select.tsx  │   ├── editor/  │   │   └── markdown-editor.tsx  │   └── layout/  │       ├── header.tsx  │       ├── footer.tsx  │       └── nav.tsx  │  ├── hooks/                        # Custom React hooks  │   ├── use-posts.ts  │   └── use-categories.ts  │  ├── store/                        # Zustand stores  │   └── ui-store.ts              # UI state (modals, etc.)  │  └── types/                        # TypeScript types      └── index.ts                 # Shared type definitions   `

### 3.2 Architectural Principles

#### 3.2.1 Type Safety (End-to-End)

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // Server: Define schema with Zod  const createPostSchema = z.object({    title: z.string().min(1).max(200),    content: z.string().min(1),    categoryIds: z.array(z.string())  });  // Server: tRPC procedure  export const postRouter = router({    create: publicProcedure      .input(createPostSchema)      .mutation(async ({ input }) => {        // TypeScript knows input structure        return await db.insert(posts).values(input);      })  });  // Client: Automatic type inference  const { mutate } = trpc.post.create.useMutation();  mutate({     title: "Hello", // ✅ Type-safe    content: "World",    categoryIds: ["cat-1"]  });   `

#### 3.2.2 Data Flow Architecture

**Server-Side Rendering (SSR) Flow:**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Request → Next.js Server → tRPC Server Procedure   → Drizzle Query → PostgreSQL → Response → Hydrated React Component   `

**Client-Side Interaction Flow:**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Action → tRPC React Hook → React Query Cache Check   → API Request (if needed) → Optimistic Update → Server Response   → Cache Update → UI Re-render   `

#### 3.2.3 Component Architecture

**Server Components (Default)**

*   Landing page sections
    
*   Blog post listing (initial load)
    
*   Individual post view
    
*   Static layouts
    

**Client Components (Interactive)**

*   Forms (create/edit post)
    
*   Category filters
    
*   Markdown editor
    
*   Modal dialogs
    
*   Toast notifications
    

### 3.3 Database Architecture

#### 3.3.1 Entity Relationship Diagram

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌─────────────────────────────┐  │         posts               │  ├─────────────────────────────┤  │ id: UUID (PK)              │  │ title: VARCHAR(200)        │  │ slug: VARCHAR(250) UNIQUE  │  │ content: TEXT              │  │ excerpt: TEXT (nullable)   │  │ published: BOOLEAN         │  │ created_at: TIMESTAMP      │  │ updated_at: TIMESTAMP      │  └─────────────────────────────┘           │           │ 1:N           ▼  ┌─────────────────────────────┐  │    post_categories          │  ├─────────────────────────────┤  │ post_id: UUID (FK)         │─┐  │ category_id: UUID (FK)     │ │  │ PRIMARY KEY (post_id,      │ │  │              category_id)  │ │  └─────────────────────────────┘ │           │                       │           │ N:1                   │           ▼                       │  ┌─────────────────────────────┐ │  │       categories            │ │  ├─────────────────────────────┤ │  │ id: UUID (PK)              │◄┘  │ name: VARCHAR(100) UNIQUE  │  │ slug: VARCHAR(120) UNIQUE  │  │ description: TEXT          │  │ created_at: TIMESTAMP      │  │ updated_at: TIMESTAMP      │  └─────────────────────────────┘   `

#### 3.3.2 Drizzle Schema Definition

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // server/db/schema.ts  import { pgTable, text, boolean, timestamp, uuid, primaryKey } from 'drizzle-orm/pg-core';  import { relations } from 'drizzle-orm';  export const posts = pgTable('posts', {    id: uuid('id').defaultRandom().primaryKey(),    title: text('title').notNull(),    slug: text('slug').notNull().unique(),    content: text('content').notNull(),    excerpt: text('excerpt'),    published: boolean('published').default(false).notNull(),    createdAt: timestamp('created_at').defaultNow().notNull(),    updatedAt: timestamp('updated_at').defaultNow().notNull(),  });  export const categories = pgTable('categories', {    id: uuid('id').defaultRandom().primaryKey(),    name: text('name').notNull().unique(),    slug: text('slug').notNull().unique(),    description: text('description'),    createdAt: timestamp('created_at').defaultNow().notNull(),    updatedAt: timestamp('updated_at').defaultNow().notNull(),  });  export const postCategories = pgTable('post_categories', {    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),    categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),  }, (table) => ({    pk: primaryKey({ columns: [table.postId, table.categoryId] }),  }));  // Relations for Drizzle Query  export const postsRelations = relations(posts, ({ many }) => ({    postCategories: many(postCategories),  }));  export const categoriesRelations = relations(categories, ({ many }) => ({    postCategories: many(postCategories),  }));  export const postCategoriesRelations = relations(postCategories, ({ one }) => ({    post: one(posts, {      fields: [postCategories.postId],      references: [posts.id],    }),    category: one(categories, {      fields: [postCategories.categoryId],      references: [categories.id],    }),  }));   `

### 3.4 tRPC Router Architecture

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // server/api/root.ts  import { router } from './trpc';  import { postRouter } from './routers/post';  import { categoryRouter } from './routers/category';  export const appRouter = router({    post: postRouter,    category: categoryRouter,  });  export type AppRouter = typeof appRouter;   `

**Router Organization:**

*   postRouter - All post-related procedures
    
*   categoryRouter - All category-related procedures
    
*   Each router contains: queries (read), mutations (write)
    

4\. Feature Requirements
------------------------

### 4.1 Priority 1: Must Have (Core Features)

#### 4.1.1 Blog Post Management

**User Stories:**

*   As a user, I can create a new blog post with title and content
    
*   As a user, I can view a list of all blog posts
    
*   As a user, I can view an individual blog post
    
*   As a user, I can edit an existing blog post
    
*   As a user, I can delete a blog post
    

**Technical Specifications:**

*   **Create Post**
    
    *   Input validation: title (1-200 chars), content (min 1 char)
        
    *   Auto-generate slug from title
        
    *   Default to draft status
        
    *   Handle category assignment
        
*   **Read Posts**
    
    *   List view: paginated results (or all if < 50 posts)
        
    *   Single view: fetch by slug with categories
        
    *   Include metadata: created/updated dates
        
*   **Update Post**
    
    *   Re-validate all inputs
        
    *   Update slug if title changes
        
    *   Update timestamp automatically
        
*   **Delete Post**
    
    *   Cascade delete post-category relationships
        
    *   Confirmation dialog on client
        

**API Endpoints (tRPC):**

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   post.create({ title, content, categoryIds, published })  post.getAll({ published?, categoryId? })  post.getBySlug({ slug })  post.update({ id, title?, content?, categoryIds?, published? })  post.delete({ id })   `

#### 4.1.2 Category Management

**User Stories:**

*   As a user, I can create categories
    
*   As a user, I can view all categories
    
*   As a user, I can edit categories
    
*   As a user, I can delete categories (if no posts assigned)
    
*   As a user, I can assign multiple categories to a post
    

**Technical Specifications:**

*   CRUD operations similar to posts
    
*   Unique name validation
    
*   Slug auto-generation
    
*   Many-to-many relationship with posts
    

**API Endpoints (tRPC):**

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   category.create({ name, description })  category.getAll()  category.update({ id, name?, description? })  category.delete({ id })   `

#### 4.1.3 Category Filtering

**User Stories:**

*   As a user, I can filter blog posts by category
    
*   As a user, I can see which categories are assigned to each post
    

**Technical Specifications:**

*   Client-side filter UI (dropdown/pills)
    
*   Server-side query filtering
    
*   Display category badges on post cards
    

#### 4.1.4 Basic UI

**Components Required:**

*   Navigation header with logo and menu
    
*   Post listing page with cards
    
*   Individual post view page
    
*   Basic responsive layout (mobile-first)
    

### 4.2 Priority 2: Should Have

#### 4.2.1 Landing Page

**Sections (Minimum 3):**

1.  **Header/Hero**
    
    *   Project title/tagline
        
    *   CTA button to view posts
        
2.  **Features Section**
    
    *   Highlight key features (3-4 items)
        
    *   Icons + descriptions
        
3.  **Footer**
    
    *   Links, copyright info
        

#### 4.2.2 Dashboard

**Features:**

*   Overview of total posts/categories
    
*   Quick actions (create new post)
    
*   Recent posts list
    
*   Stats display
    

#### 4.2.3 Post Status

**Draft vs Published:**

*   Toggle on post form
    
*   Filter by status in dashboard
    
*   Visual indicators
    

#### 4.2.4 Enhanced UX

**Loading States:**

*   Skeleton loaders for lists
    
*   Spinner for form submissions
    
*   React Query loading states
    

**Error Handling:**

*   Toast notifications for errors
    
*   Form validation errors
    
*   Empty states
    

#### 4.2.5 Content Editor

**Markdown Editor (Recommended):**

*   Textarea with preview toggle
    
*   Basic markdown syntax support
    
*   Auto-save to local state (not localStorage)
    

### 4.3 Priority 3: Nice to Have

*   Full 5-section landing page
    
*   Search functionality
    
*   Post statistics (reading time, word count)
    
*   Dark mode
    
*   Image uploads
    
*   SEO meta tags
    
*   Pagination
    

5\. API Specifications
----------------------

### 5.1 tRPC Procedures

#### Post Router

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // Query Procedures (Reads)  getAll: publicProcedure    .input(z.object({      published: z.boolean().optional(),      categoryId: z.string().uuid().optional(),      limit: z.number().min(1).max(100).default(50),    }))    .query(async ({ input }) => { /* ... */ })  getBySlug: publicProcedure    .input(z.object({ slug: z.string() }))    .query(async ({ input }) => { /* ... */ })  // Mutation Procedures (Writes)  create: publicProcedure    .input(z.object({      title: z.string().min(1).max(200),      content: z.string().min(1),      excerpt: z.string().max(500).optional(),      published: z.boolean().default(false),      categoryIds: z.array(z.string().uuid()),    }))    .mutation(async ({ input }) => { /* ... */ })  update: publicProcedure    .input(z.object({      id: z.string().uuid(),      title: z.string().min(1).max(200).optional(),      content: z.string().min(1).optional(),      published: z.boolean().optional(),      categoryIds: z.array(z.string().uuid()).optional(),    }))    .mutation(async ({ input }) => { /* ... */ })  delete: publicProcedure    .input(z.object({ id: z.string().uuid() }))    .mutation(async ({ input }) => { /* ... */ })   `

#### Category Router

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   getAll: publicProcedure    .query(async () => { /* ... */ })  create: publicProcedure    .input(z.object({      name: z.string().min(1).max(100),      description: z.string().max(500).optional(),    }))    .mutation(async ({ input }) => { /* ... */ })  update: publicProcedure    .input(z.object({      id: z.string().uuid(),      name: z.string().min(1).max(100).optional(),      description: z.string().max(500).optional(),    }))    .mutation(async ({ input }) => { /* ... */ })  delete: publicProcedure    .input(z.object({ id: z.string().uuid() }))    .mutation(async ({ input }) => { /* ... */ })   `

6\. State Management Strategy
-----------------------------

### 6.1 Server State (React Query via tRPC)

**What to Store:**

*   All blog posts
    
*   All categories
    
*   Individual post data
    

**Strategy:**

*   Use tRPC's built-in React Query integration
    
*   Implement optimistic updates for mutations
    
*   Configure stale time: 5 minutes
    
*   Cache time: 10 minutes
    

### 6.2 Client State (Zustand)

**What to Store:**

*   UI state (modals open/closed)
    
*   Toast notifications
    
*   Theme preference (if dark mode)
    
*   Form drafts (editor content)
    

**Store Structure:**

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   interface UIStore {    isModalOpen: boolean;    modalType: 'delete' | 'create' | null;    toast: { message: string; type: 'success' | 'error' } | null;    setModal: (type: string) => void;    closeModal: () => void;    showToast: (message: string, type: string) => void;  }   `

### 6.3 Form State (React Hook Form)

*   Use for all forms (create/edit post, categories)
    
*   Integrate with Zod validation
    
*   Handle submission states
    

7\. UI/UX Specifications
------------------------

### 7.1 Design System

**Colors (Tailwind):**

*   Primary: blue-600 (CTAs, links)
    
*   Secondary: slate-700 (text)
    
*   Background: white / slate-50
    
*   Borders: slate-200
    
*   Success: green-600
    
*   Error: red-600
    

**Typography:**

*   Headings: font-bold, text-2xl to text-4xl
    
*   Body: font-normal, text-base
    
*   Monospace: font-mono (for code/markdown)
    

**Spacing:**

*   Container: max-w-7xl mx-auto px-4
    
*   Sections: py-12 to py-20
    
*   Cards: p-6
    

### 7.2 Component Specifications

#### Post Card

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌─────────────────────────────────┐  │  [Categories]                   │  │  Post Title (Truncated)         │  │  Excerpt (2 lines)              │  │  ────────────────────────────   │  │  Date | Read More →             │  └─────────────────────────────────┘   `

#### Post Form

*   Title input (required)
    
*   Content textarea/editor (required)
    
*   Category multi-select
    
*   Published toggle
    
*   Submit/Cancel buttons
    

### 7.3 Responsive Breakpoints

*   Mobile: < 640px (1 column)
    
*   Tablet: 640px - 1024px (2 columns)
    
*   Desktop: > 1024px (3 columns for cards)
    

8\. Performance Optimizations
-----------------------------

### 8.1 Next.js Optimizations

*   Use Server Components by default
    
*   Implement React Suspense for loading states
    
*   Use dynamic imports for heavy components
    
*   Optimize images with next/image
    

### 8.2 Database Optimizations

*   Index on slug columns
    
*   Index on published column
    
*   Use Drizzle's query API for efficient joins
    
*   Limit query results (pagination)
    

### 8.3 React Query Optimizations

*   Implement optimistic updates
    
*   Prefetch data on hover
    
*   Configure appropriate cache times
    
*   Use query invalidation strategically
    

9\. Error Handling Strategy
---------------------------

### 9.1 Validation Errors

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // Server-side with Zod  if (!validationResult.success) {    throw new TRPCError({      code: 'BAD_REQUEST',      message: 'Validation failed',      cause: validationResult.error,    });  }   `

### 9.2 Database Errors

*   Catch unique constraint violations (slug, name)
    
*   Handle foreign key errors gracefully
    
*   Return user-friendly messages
    

### 9.3 Client-Side Error Display

*   Toast notifications for mutations
    
*   Inline form errors
    
*   Error boundaries for critical sections
    
*   Fallback UI for failed loads
    

10\. Development Workflow
-------------------------

### 10.1 Environment Setup

**.env.local:**

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Supabase  DATABASE_URL="postgresql://..."  DIRECT_URL="postgresql://..."  # For migrations  # App  NEXT_PUBLIC_APP_URL="http://localhost:3000"   `

### 10.2 Scripts

**package.json:**

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "scripts": {      "dev": "next dev",      "build": "next build",      "start": "next start",      "db:push": "drizzle-kit push",      "db:studio": "drizzle-kit studio",      "db:seed": "tsx scripts/seed.ts",      "type-check": "tsc --noEmit",      "lint": "next lint"    }  }   `

### 10.3 Database Seeding

**seed.ts:**

typescript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // Create sample categories  const categories = await db.insert(categoriesTable).values([    { name: 'Technology', slug: 'technology' },    { name: 'Design', slug: 'design' },    { name: 'Business', slug: 'business' },  ]).returning();  // Create sample posts  const posts = await db.insert(postsTable).values([    {      title: 'Getting Started with Next.js',      slug: 'getting-started-with-nextjs',      content: '...',      published: true,    },    // ... more posts  ]).returning();  // Create relationships  await db.insert(postCategoriesTable).values([    { postId: posts[0].id, categoryId: categories[0].id },    // ... more relationships  ]);   `

11\. Testing Strategy (Optional but Recommended)
------------------------------------------------

### 11.1 Unit Tests

*   Utility functions (slugify, validators)
    
*   Zod schema validation
    

### 11.2 Integration Tests

*   tRPC procedures
    
*   Database operations
    

### 11.3 E2E Tests (Time Permitting)

*   Critical user flows
    
*   Post creation/editing
    
*   Category filtering
    

12\. Deployment
---------------

### 12.1 Vercel Deployment

**Steps:**

1.  Push code to GitHub
    
2.  Connect repository to Vercel
    
3.  Configure environment variables
    
4.  Deploy
    

**Environment Variables (Vercel):**

*   DATABASE\_URL
    
*   DIRECT\_URL
    
*   NEXT\_PUBLIC\_APP\_URL
    

### 12.2 Database Setup (Supabase)

1.  Create new Supabase project
    
2.  Get connection string
    
3.  Run Drizzle migrations: npm run db:push
    
4.  Seed database: npm run db:seed
    

13\. Success Metrics
--------------------

### 13.1 Technical Metrics

*   ✅ All Priority 1 features working
    
*   ✅ Type errors: 0
    
*   ✅ Build warnings: < 5
    
*   ✅ Lighthouse score: > 90
    
*   ✅ All tRPC procedures tested manually
    

### 13.2 Code Quality Metrics

*   ✅ No any types (except necessary cases)
    
*   ✅ All files < 300 lines
    
*   ✅ Consistent naming conventions
    
*   ✅ Proper error handling everywhere
    

14\. Risk Mitigation
--------------------

### 14.1 Technical Risks

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   RiskImpactMitigationtRPC setup complexityHighFollow official docs, use starter templateDrizzle learning curveMediumUse Drizzle Studio for debuggingSupabase connection issuesMediumTest connection early, use connection poolingTime constraintsHighPrioritize P1 features, use shadcn/ui   `

### 14.2 Scope Management

*   **If behind schedule**: Drop Priority 3 features
    
*   **If ahead**: Polish UI, add search
    
*   **Daily check**: Assess progress vs timeline
    

15\. Documentation Requirements
-------------------------------

### 15.1 README Structure

markdown

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML``   # Multi-User Blogging Platform  ## 🚀 Tech Stack  - Next.js 15, TypeScript, tRPC, Drizzle ORM, PostgreSQL (Supabase)  ## 📋 Features Implemented  - [x] Blog post CRUD  - [x] Category management  - [x] Category filtering  - [ ] Search functionality  ## 🛠️ Setup Instructions  1. Clone repository  2. Install dependencies: `npm install`  3. Set up environment variables (see .env.example)  4. Push database schema: `npm run db:push`  5. Seed database: `npm run db:seed`  6. Run dev server: `npm run dev`  ## 📁 Project Structure  (Include folder structure diagram)  ## 🏗️ Architecture Decisions  - Chose markdown over rich text for simplicity  - Used shadcn/ui for faster UI development  - Implemented optimistic updates for better UX  ## ⏱️ Time Spent  ~14 hours total  ## 🔗 Live Demo  https://your-app.vercel.app   ``

16\. Conclusion
---------------

This PRD provides a comprehensive technical blueprint for building a production-ready blogging platform with modern web technologies. The architecture prioritizes type safety, developer experience, and maintainability while allowing flexibility to meet the 7-day timeline.

**Key Success Factors:**

1.  Start with database schema and tRPC setup (solid foundation)
    
2.  Build Priority 1 features first (core functionality)
    
3.  Use time-saving tools (shadcn/ui, markdown)
    
4.  Test continuously (don't wait until end)
    
5.  Document as you build (easier than after)
    

**Remember:** Clean, working core features > rushed complete implementation.