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
export const insertPostSchema = createInsertSchema(posts).omit({
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
export const insertCategorySchema = createInsertSchema(categories).omit({
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
