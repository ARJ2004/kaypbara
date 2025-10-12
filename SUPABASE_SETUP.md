# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Choose a name and strong password for your database
4. Wait for the project to be created

## 2. Get Your Database Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **Database**
3. Scroll down to **Connection string**
4. Copy the **URI** connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password

## 3. Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 4. Run Database Migrations

Once you've set up your environment variables, run:

```bash
# Generate migration files
npm run db:generate

# Push schema to Supabase
npm run db:push

# Optional: Open Drizzle Studio to view your database
npm run db:studio
```

## 5. Seed the Database (Optional)

To populate your database with sample data:

```bash
npm run db:seed
```

## 6. Verify Setup

1. Run `npm run dev` to start your development server
2. Check that your application loads without database errors
3. Use Drizzle Studio (`npm run db:studio`) to verify tables were created correctly

## Troubleshooting

- **Connection Error**: Double-check your `DATABASE_URL` in `.env.local`
- **Migration Error**: Ensure your Supabase project is active and accessible
- **Permission Error**: Make sure your database password is correct

## Database Schema

Your database will include these tables:
- `posts` - Blog posts with title, content, slug, etc.
- `categories` - Post categories
- `post_categories` - Many-to-many relationship between posts and categories

All tables include proper indexes for performance and foreign key constraints for data integrity.
