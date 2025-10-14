# Database Schema Design Reference
## Multi-User Blogging Platform

---

## Overview

This document serves as the single source of truth for the database schema design. All tables, relationships, indexes, and constraints are defined here using Drizzle ORM syntax.

**Database:** PostgreSQL (Supabase)  
**ORM:** Drizzle ORM  
**Migration Tool:** Drizzle Kit

---

## Schema Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS TABLE                              │
├─────────────────────────────────────────────────────────────────┤
│ PK  id              UUID        NOT NULL                        │
│ UK  email           VARCHAR(255) NOT NULL UNIQUE                │
│     full_name       VARCHAR(255) NULL                           │
│     avatar_url      TEXT        NULL                            │
│     created_at      TIMESTAMP   DEFAULT now() NOT NULL          │
│     updated_at      TIMESTAMP   DEFAULT now() NOT NULL          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1
                              │
                              │
                              ▼ N
┌─────────────────────────────────────────────────────────────────┐
│                         POSTS TABLE                              │
├─────────────────────────────────────────────────────────────────┤
│ PK  id              UUID        DEFAULT gen_random_uuid()       │
│     title           VARCHAR(200) NOT NULL                        │
│ UK  slug            VARCHAR(250) NOT NULL UNIQUE                 │
│     content         TEXT        NOT NULL                         │
│     excerpt         TEXT        NULL                             │
│ FK  author_id       UUID        NOT NULL → users.id             │
│     published       BOOLEAN     DEFAULT false NOT NULL           │
│ IDX created_at      TIMESTAMP   DEFAULT now() NOT NULL           │
│     updated_at      TIMESTAMP   DEFAULT now() NOT NULL           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1
                              │
                              │
                              ▼ N
┌─────────────────────────────────────────────────────────────────┐
│                    POST_CATEGORIES TABLE                         │
│                     (Junction Table)                             │
├─────────────────────────────────────────────────────────────────┤
│ PK,FK post_id       UUID        NOT NULL → posts.id             │
│ PK,FK category_id   UUID        NOT NULL → categories.id        │
│                                                                  │
│ PRIMARY KEY (post_id, category_id)                              │
│ ON DELETE CASCADE for both foreign keys                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ N
                              │
                              │
                              ▼ 1
┌─────────────────────────────────────────────────────────────────┐
│                      CATEGORIES TABLE                            │
├─────────────────────────────────────────────────────────────────┤
│ PK  id              UUID        DEFAULT gen_random_uuid()       │
│ UK  name            VARCHAR(100) NOT NULL UNIQUE                │
│ UK  slug            VARCHAR(120) NOT NULL UNIQUE                │
│     description     TEXT        NULL                            │
│     created_at      TIMESTAMP   DEFAULT now() NOT NULL          │
│     updated_at      TIMESTAMP   DEFAULT now() NOT NULL          │
└─────────────────────────────────────────────────────────────────┘
```

**Legend:**
- PK = Primary Key
- FK = Foreign Key
- UK = Unique Key
- IDX = Indexed Column

---

## Complete Drizzle Schema Implementation

### File: `server/db/schema.ts`

```typescript
import { 
  pgTable, 
  text, 
  boolean, 
  timestamp, 
  uuid, 
  primaryKey,
  varchar,
  index
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// ============================================================================
// USERS TABLE
// ============================================================================

export const users = pgTable('users', {
  // Primary Key
  id: uuid('id').primaryKey(),
  
  // User Information
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Indexes
  emailIdx: index('users_email_idx').on(table.email),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(users);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ============================================================================
// POSTS TABLE
// ============================================================================

export const posts = pgTable('posts', {
  // Primary Key
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Content Fields
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 250 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'), // Optional: short preview text
  
  // Author Information
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  
  // Status
  published: boolean('published').default(false).notNull(),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Additional indexes for performance
  publishedIdx: index('posts_published_idx').on(table.published),
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
  slugIdx: index('posts_slug_idx').on(table.slug),
  authorIdIdx: index('posts_author_id_idx').on(table.authorId),
}));

// Relations for type-safe joins
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  postCategories: many(postCategories),
}));

// Zod schemas for validation
export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500).optional(),
  slug: z.string().min(1).max(250),
  authorId: z.string().uuid('Invalid author ID'),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectPostSchema = createSelectSchema(posts);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// ============================================================================
// CATEGORIES TABLE
// ============================================================================

export const categories = pgTable('categories', {
  // Primary Key
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Content Fields
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  description: text('description'),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Indexes
  nameIdx: index('categories_name_idx').on(table.name),
  slugIdx: index('categories_slug_idx').on(table.slug),
}));

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

// Zod schemas
export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  slug: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectCategorySchema = createSelectSchema(categories);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

// ============================================================================
// POST_CATEGORIES TABLE (Junction/Join Table)
// ============================================================================

export const postCategories = pgTable('post_categories', {
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
}, (table) => ({
  // Composite primary key
  pk: primaryKey({ columns: [table.postId, table.categoryId] }),
  // Indexes for query performance
  postIdIdx: index('post_categories_post_id_idx').on(table.postId),
  categoryIdIdx: index('post_categories_category_id_idx').on(table.categoryId),
}));

// Relations for both sides
export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

// Zod schema
export const insertPostCategorySchema = createInsertSchema(postCategories);
export const selectPostCategorySchema = createSelectSchema(postCategories);

export type PostCategory = typeof postCategories.$inferSelect;
export type NewPostCategory = typeof postCategories.$inferInsert;
```

---

## Database Setup Files

### File: `server/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

// For migrations (with max 1 connection)
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries (connection pool)
const queryClient = postgres(connectionString);

// Create Drizzle instance with schema
export const db = drizzle(queryClient, { schema });

// Type export for use across the app
export type DbType = typeof db;
```

### File: `drizzle.config.ts` (Root level)

```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export default {
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

---

## Query Patterns & Examples

### 1. Basic CRUD Operations

#### Create User
```typescript
import { db } from '@/server/db';
import { users } from '@/server/db/schema';

// Insert user
const [newUser] = await db.insert(users).values({
  id: 'user-uuid-from-auth',
  email: 'user@example.com',
  fullName: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
}).returning();
```

#### Read User
```typescript
// Get user by ID
const user = await db.query.users.findFirst({
  where: eq(users.id, 'user-uuid'),
});

// Get user by email
const user = await db.query.users.findFirst({
  where: eq(users.email, 'user@example.com'),
});

// Get user with their posts
const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, 'user-uuid'),
  with: {
    posts: {
      where: eq(posts.published, true),
      orderBy: [desc(posts.createdAt)],
    },
  },
});
```

#### Update User
```typescript
// Update user information
const [updatedUser] = await db
  .update(users)
  .set({
    fullName: 'John Smith',
    avatarUrl: 'https://example.com/new-avatar.jpg',
    updatedAt: new Date(),
  })
  .where(eq(users.id, userId))
  .returning();
```

#### Create Post
```typescript
import { db } from '@/server/db';
import { posts, postCategories } from '@/server/db/schema';

// Insert post with author
const [newPost] = await db.insert(posts).values({
  title: 'My First Post',
  slug: 'my-first-post',
  content: 'This is the content...',
  authorId: 'user-uuid-here',
  published: true,
}).returning();

// Assign categories (many-to-many)
const categoryIds = ['cat-id-1', 'cat-id-2'];
if (categoryIds.length > 0) {
  await db.insert(postCategories).values(
    categoryIds.map(categoryId => ({
      postId: newPost.id,
      categoryId,
    }))
  );
}
```

#### Read Posts (with relations)
```typescript
import { db } from '@/server/db';
import { eq, desc } from 'drizzle-orm';

// Get all published posts with categories and author
const allPosts = await db.query.posts.findMany({
  where: eq(posts.published, true),
  with: {
    author: true,
    postCategories: {
      with: {
        category: true,
      },
    },
  },
  orderBy: [desc(posts.createdAt)],
});

// Transform data for easier use
const postsWithCategories = allPosts.map(post => ({
  ...post,
  categories: post.postCategories.map(pc => pc.category),
}));
```

#### Read Single Post by Slug
```typescript
const post = await db.query.posts.findFirst({
  where: eq(posts.slug, 'my-first-post'),
  with: {
    author: true,
    postCategories: {
      with: {
        category: true,
      },
    },
  },
});

if (!post) {
  throw new Error('Post not found');
}

// Access author and categories
const author = post.author;
const categories = post.postCategories.map(pc => pc.category);
```

#### Update Post
```typescript
import { eq } from 'drizzle-orm';

// Update post content
const [updatedPost] = await db
  .update(posts)
  .set({
    title: 'Updated Title',
    content: 'Updated content...',
    updatedAt: new Date(),
  })
  .where(eq(posts.id, postId))
  .returning();

// Update categories (remove old, add new)
// 1. Delete existing relationships
await db
  .delete(postCategories)
  .where(eq(postCategories.postId, postId));

// 2. Insert new relationships
await db.insert(postCategories).values(
  newCategoryIds.map(categoryId => ({
    postId,
    categoryId,
  }))
);
```

#### Delete Post
```typescript
// Delete post (cascade will remove post_categories entries)
await db.delete(posts).where(eq(posts.id, postId));
```

### 2. Advanced Query Patterns

#### Get Posts by Author
```typescript
// Get all posts by a specific author
const authorPosts = await db.query.posts.findMany({
  where: eq(posts.authorId, 'user-uuid'),
  with: {
    postCategories: {
      with: { category: true },
    },
  },
  orderBy: [desc(posts.createdAt)],
});

// Get published posts by author
const publishedAuthorPosts = await db.query.posts.findMany({
  where: and(
    eq(posts.authorId, 'user-uuid'),
    eq(posts.published, true)
  ),
  with: {
    postCategories: {
      with: { category: true },
    },
  },
});
```

#### Get Authors with Post Count
```typescript
import { count, sql } from 'drizzle-orm';

const authorsWithCount = await db
  .select({
    id: users.id,
    email: users.email,
    fullName: users.fullName,
    avatarUrl: users.avatarUrl,
    postCount: count(posts.id),
  })
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))
  .groupBy(users.id)
  .orderBy(desc(count(posts.id)));
```

#### Filter Posts by Category
```typescript
import { eq, inArray } from 'drizzle-orm';

// Method 1: Using Drizzle Query API
const postsInCategory = await db.query.posts.findMany({
  where: (posts, { exists }) => exists(
    db.select()
      .from(postCategories)
      .where(
        eq(postCategories.postId, posts.id),
        eq(postCategories.categoryId, categoryId)
      )
  ),
  with: {
    postCategories: {
      with: { category: true },
    },
  },
});

// Method 2: Using Query Builder
const postsInCategory = await db
  .select()
  .from(posts)
  .innerJoin(postCategories, eq(posts.id, postCategories.postId))
  .where(eq(postCategories.categoryId, categoryId));
```

#### Get Posts with Multiple Categories (OR condition)
```typescript
const categoryIds = ['cat-1', 'cat-2', 'cat-3'];

const posts = await db
  .selectDistinct()
  .from(posts)
  .innerJoin(postCategories, eq(posts.id, postCategories.postId))
  .where(inArray(postCategories.categoryId, categoryIds));
```

#### Get Categories with Post Count
```typescript
import { count, sql } from 'drizzle-orm';

const categoriesWithCount = await db
  .select({
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
    postCount: count(postCategories.postId),
  })
  .from(categories)
  .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
  .groupBy(categories.id);
```

#### Search Posts by Title or Content
```typescript
import { ilike, or } from 'drizzle-orm';

const searchTerm = 'typescript';

const searchResults = await db.query.posts.findMany({
  where: or(
    ilike(posts.title, `%${searchTerm}%`),
    ilike(posts.content, `%${searchTerm}%`)
  ),
  with: {
    postCategories: {
      with: { category: true },
    },
  },
});
```

#### Pagination
```typescript
const page = 1;
const pageSize = 10;
const offset = (page - 1) * pageSize;

const paginatedPosts = await db.query.posts.findMany({
  limit: pageSize,
  offset: offset,
  orderBy: [desc(posts.createdAt)],
  with: {
    postCategories: {
      with: { category: true },
    },
  },
});

// Get total count
const [{ count: totalPosts }] = await db
  .select({ count: count() })
  .from(posts);

const totalPages = Math.ceil(totalPosts / pageSize);
```

### 3. Transaction Example

```typescript
import { db } from '@/server/db';

// Create post with categories in a transaction
await db.transaction(async (tx) => {
  // Insert post
  const [newPost] = await tx.insert(posts).values({
    title: 'My Post',
    slug: 'my-post',
    content: 'Content...',
  }).returning();

  // Insert categories
  await tx.insert(postCategories).values(
    categoryIds.map(categoryId => ({
      postId: newPost.id,
      categoryId,
    }))
  );

  return newPost;
});
```

---

## Validation Schemas (Zod)

### User Validation

```typescript
// server/lib/validators.ts
import { z } from 'zod';

export const createUserInput = z.object({
  id: z.string().uuid('Invalid user ID'),
  email: z.string().email('Invalid email address').max(255, 'Email too long'),
  fullName: z.string().max(255, 'Full name too long').optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
});

export const updateUserInput = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255).optional(),
  fullName: z.string().max(255).optional(),
  avatarUrl: z.string().url().optional(),
});

export const getUserInput = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional(),
});
```

### Post Validation

```typescript
// server/lib/validators.ts
import { z } from 'zod';

export const createPostInput = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt is too long').optional(),
  authorId: z.string().uuid('Invalid author ID'),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string().uuid()).min(0).max(10, 'Too many categories'),
});

export const updatePostInput = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional(),
  authorId: z.string().uuid().optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.string().uuid()).min(0).max(10).optional(),
});

export const deletePostInput = z.object({
  id: z.string().uuid(),
});

export const getPostBySlugInput = z.object({
  slug: z.string().min(1),
});

export const getPostsInput = z.object({
  published: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});
```

### Category Validation

```typescript
export const createCategoryInput = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

export const updateCategoryInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const deleteCategoryInput = z.object({
  id: z.string().uuid(),
});
```

---

## Database Indexes Strategy

### Indexes Explained

```typescript
// Primary Indexes (Automatically created)
- users.id (Primary Key) ✓
- posts.id (Primary Key) ✓
- categories.id (Primary Key) ✓
- postCategories.(postId, categoryId) (Composite Primary Key) ✓

// Unique Indexes (For data integrity)
- users.email (Unique) ✓
- posts.slug (Unique) ✓
- categories.name (Unique) ✓
- categories.slug (Unique) ✓

// Performance Indexes (For query optimization)
- users.email (Lookup by email)
- posts.published (Filter by status)
- posts.createdAt (Sort by date)
- posts.authorId (Filter by author)
- postCategories.postId (Join queries)
- postCategories.categoryId (Join queries)
```

### When to Add More Indexes

Add indexes if you frequently query by:
- Post author (already added: posts.authorId)
- User creation date (if needed for user analytics)
- Post views/popularity (if adding analytics)
- Category popularity
- Full-text search (use PostgreSQL's `tsvector`)

---

## Migration Commands

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Push schema directly to database (no migration files)
npx drizzle-kit push

# View your database in browser
npx drizzle-kit studio

# Apply migrations
npx drizzle-kit migrate
```

---

## Seed Data Script

### File: `scripts/seed.ts`

```typescript
import { db } from '../src/server/db';
import { users, posts, categories, postCategories } from '../src/server/db/schema';
import { slugify } from '../src/lib/slugify';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in correct order due to foreign keys)
  await db.delete(postCategories);
  await db.delete(posts);
  await db.delete(categories);
  await db.delete(users);

  // Seed users
  const usersData = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'jane.smith@example.com',
      fullName: 'Jane Smith',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      email: 'mike.wilson@example.com',
      fullName: 'Mike Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
  ];

  const insertedUsers = await db
    .insert(users)
    .values(usersData)
    .returning();

  console.log(`✓ Created ${insertedUsers.length} users`);

  // Seed categories
  const categoriesData = [
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Articles about the latest in tech',
    },
    {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Web development tutorials and best practices',
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'UI/UX design principles and inspiration',
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Business strategies and insights',
    },
    {
      name: 'Productivity',
      slug: 'productivity',
      description: 'Tips and tools to boost productivity',
    },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoriesData)
    .returning();

  console.log(`✓ Created ${insertedCategories.length} categories`);

  // Seed posts
  const postsData = [
    {
      title: 'Getting Started with Next.js 15',
      slug: 'getting-started-with-nextjs-15',
      content: `# Getting Started with Next.js 15

Next.js 15 introduces several exciting features that make building web applications even better...

## What's New

- Improved App Router
- Better performance
- Enhanced developer experience

This is a comprehensive guide to help you get started.`,
      excerpt: 'Learn about the new features in Next.js 15 and how to get started',
      authorId: insertedUsers[0].id, // John Doe
      published: true,
    },
    {
      title: 'TypeScript Best Practices in 2025',
      slug: 'typescript-best-practices-2025',
      content: `# TypeScript Best Practices

TypeScript has become the standard for building robust JavaScript applications...`,
      excerpt: 'Modern TypeScript patterns and practices for better code',
      authorId: insertedUsers[1].id, // Jane Smith
      published: true,
    },
    {
      title: 'Building Type-Safe APIs with tRPC',
      slug: 'building-type-safe-apis-trpc',
      content: `# Building Type-Safe APIs with tRPC

tRPC provides end-to-end type safety for your APIs...`,
      excerpt: 'Complete guide to building type-safe APIs',
      authorId: insertedUsers[0].id, // John Doe
      published: true,
    },
    {
      title: 'Mastering Tailwind CSS',
      slug: 'mastering-tailwind-css',
      content: `# Mastering Tailwind CSS

Tailwind CSS is a utility-first framework...`,
      excerpt: 'Learn advanced Tailwind CSS techniques',
      authorId: insertedUsers[2].id, // Mike Wilson
      published: true,
    },
    {
      title: 'Draft: Upcoming Features',
      slug: 'draft-upcoming-features',
      content: `# Upcoming Features

This is a draft post about upcoming features...`,
      excerpt: 'A draft post for testing',
      authorId: insertedUsers[1].id, // Jane Smith
      published: false,
    },
  ];

  const insertedPosts = await db
    .insert(posts)
    .values(postsData)
    .returning();

  console.log(`✓ Created ${insertedPosts.length} posts`);

  // Seed post-category relationships
  const relationships = [
    { postIndex: 0, categoryIndex: 0 }, // Next.js -> Technology
    { postIndex: 0, categoryIndex: 1 }, // Next.js -> Web Development
    { postIndex: 1, categoryIndex: 0 }, // TypeScript -> Technology
    { postIndex: 1, categoryIndex: 1 }, // TypeScript -> Web Development
    { postIndex: 2, categoryIndex: 1 }, // tRPC -> Web Development
    { postIndex: 3, categoryIndex: 2 }, // Tailwind -> Design
    { postIndex: 3, categoryIndex: 1 }, // Tailwind -> Web Development
    { postIndex: 4, categoryIndex: 0 }, // Draft -> Technology
  ];

  await db.insert(postCategories).values(
    relationships.map(({ postIndex, categoryIndex }) => ({
      postId: insertedPosts[postIndex].id,
      categoryId: insertedCategories[categoryIndex].id,
    }))
  );

  console.log(`✓ Created ${relationships.length} post-category relationships`);
  console.log('✅ Seeding complete!');
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
```

---

## Type Utilities

### File: `types/index.ts`

```typescript
import type { User, Post, Category, PostCategory } from '@/server/db/schema';

// Post with its categories and author (denormalized for easier use)
export interface PostWithCategories extends Post {
  categories: Category[];
  author: User;
}

// Post with author only
export interface PostWithAuthor extends Post {
  author: User;
}

// User with post count
export interface UserWithPostCount extends User {
  postCount: number;
}

// Category with post count
export interface CategoryWithCount extends Category {
  postCount: number;
}

// Post form data (for creating/editing)
export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  published: boolean;
  categoryIds: string[];
}

// User form data
export interface UserFormData {
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

// Category form data
export interface CategoryFormData {
  name: string;
  description?: string;
}
```

---

## Common Issues & Solutions

### Issue 1: Duplicate Slug
```typescript
// Solution: Check before insert
const existingPost = await db.query.posts.findFirst({
  where: eq(posts.slug, slug),
});

if (existingPost) {
  // Generate unique slug: "my-post" -> "my-post-2"
  const similarPosts = await db.query.posts.findMany({
    where: like(posts.slug, `${slug}%`),
  });
  slug = `${slug}-${similarPosts.length + 1}`;
}
```

### Issue 2: Cascade Delete Not Working
```typescript
// Ensure onDelete: 'cascade' is set in schema
.references(() => posts.id, { onDelete: 'cascade' })
```

### Issue 3: User Not Found When Creating Post
```typescript
// Solution: Ensure user exists before creating post
const user = await db.query.users.findFirst({
  where: eq(users.id, authorId),
});

if (!user) {
  throw new Error('Author not found');
}

// Then create post with valid authorId
```

### Issue 4: Slow Queries
```typescript
// Solution: Add indexes
// Check query performance in Drizzle Studio
// Use EXPLAIN ANALYZE in PostgreSQL
```

---

## Performance Tips

1. **Use indexes** on frequently queried columns
2. **Limit results** with `.limit()` and pagination
3. **Select only needed columns** instead of `SELECT *`
4. **Use transactions** for multiple related operations
5. **Cache frequently accessed data** with React Query
6. **Use connection pooling** (automatically handled by postgres.js)

---

## Reference Links

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle Queries](https://orm.drizzle.team/docs/rqb)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)

---

**Last Updated:** Updated to include users table with author relationships. Reference this file whenever working with database operations.