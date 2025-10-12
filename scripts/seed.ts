import { db } from '../src/server/db';
import { posts, categories, postCategories, users } from '../src/server/db/schema';
import { slugify } from '../src/server/lib/slugify';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in correct order due to foreign keys)
  await db.delete(postCategories);
  await db.delete(posts);
  await db.delete(categories);
  await db.delete(users);

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

  // Seed a test user
  const testUser = {
    id: '00000000-0000-0000-0000-000000000000', // Fixed UUID for testing
    email: 'test@example.com',
    fullName: 'Test User',
    avatarUrl: null,
  };

  const insertedUser = await db
    .insert(users)
    .values(testUser)
    .returning();

  console.log(`✓ Created test user`);

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
      published: true,
      authorId: testUser.id,
    },
    {
      title: 'TypeScript Best Practices in 2025',
      slug: 'typescript-best-practices-2025',
      content: `# TypeScript Best Practices

TypeScript has become the standard for building robust JavaScript applications...`,
      excerpt: 'Modern TypeScript patterns and practices for better code',
      published: true,
      authorId: testUser.id,
    },
    {
      title: 'Building Type-Safe APIs with tRPC',
      slug: 'building-type-safe-apis-trpc',
      content: `# Building Type-Safe APIs with tRPC

tRPC provides end-to-end type safety for your APIs...`,
      excerpt: 'Complete guide to building type-safe APIs',
      published: true,
      authorId: testUser.id,
    },
    {
      title: 'Mastering Tailwind CSS',
      slug: 'mastering-tailwind-css',
      content: `# Mastering Tailwind CSS

Tailwind CSS is a utility-first framework...`,
      excerpt: 'Learn advanced Tailwind CSS techniques',
      published: true,
      authorId: testUser.id,
    },
    {
      title: 'Draft: Upcoming Features',
      slug: 'draft-upcoming-features',
      content: `# Upcoming Features

This is a draft post about upcoming features...`,
      excerpt: 'A draft post for testing',
      published: false,
      authorId: testUser.id,
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
