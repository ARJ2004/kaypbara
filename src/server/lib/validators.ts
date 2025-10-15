import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string().uuid()),
});

export const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const getPostsSchema = z.object({
  published: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  limit: z.number().min(1).max(100).default(50),
});

export const getPostBySlugSchema = z.object({
  slug: z.string(),
});
