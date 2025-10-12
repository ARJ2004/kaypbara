# Blogify - Modern Blogging Platform

A beautiful, modern blogging platform with Google SSO authentication, built with Next.js 15, TypeScript, tRPC, Drizzle ORM, and Supabase.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: tRPC v11, Drizzle ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth with Google SSO
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query (via tRPC)
- **Content**: Markdown with react-markdown

## 📋 Features Implemented

- [x] Beautiful landing page with parallax effects
- [x] Google SSO authentication
- [x] User management system
- [x] Blog post CRUD operations
- [x] Category management
- [x] Category filtering
- [x] Responsive design
- [x] Type-safe API with tRPC
- [x] Markdown content support
- [x] Dashboard interface
- [x] Public blog listing
- [x] Modern UI with custom design system

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- npm or yarn

### 1. Clone and Install

```bash
git clone <repository-url>
cd kaypbara-blog
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Enable Google OAuth in Authentication > Providers
4. Add your domain to the allowed redirect URLs

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Push database schema
npm run db:push

# (Optional) Open Drizzle Studio to view your database
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard pages group
│   │   ├── dashboard/           # Dashboard home
│   │   ├── posts/               # Post management
│   │   └── categories/          # Category management
│   ├── posts/                   # Public blog pages
│   │   └── [slug]/             # Individual post view
│   ├── api/trpc/               # tRPC API routes
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── server/                      # Backend logic
│   ├── db/                     # Database setup
│   │   ├── schema.ts           # Drizzle schema
│   │   └── index.ts            # Database client
│   ├── api/                    # tRPC setup
│   │   ├── trpc.ts             # tRPC config
│   │   ├── root.ts             # Root router
│   │   └── routers/            # API routers
│   └── lib/                    # Server utilities
├── lib/                        # Shared utilities
│   ├── trpc/                   # tRPC client setup
│   └── utils.ts                # Utility functions
├── components/                 # React components
│   └── ui/                     # shadcn/ui components
└── types/                      # TypeScript types
```

## 🏗️ Architecture Decisions

- **Markdown over Rich Text**: Chosen for simplicity and time efficiency
- **shadcn/ui**: Pre-built components for faster UI development
- **tRPC**: End-to-end type safety with automatic React Query integration
- **Drizzle ORM**: Type-safe database queries with excellent TypeScript support
- **Server Components**: Default for better performance, Client Components only when needed

## 🎯 Key Features

### Blog Post Management
- Create, read, update, delete posts
- Markdown content support with preview
- Draft/Published status
- Category assignment
- Auto-generated slugs

### Category System
- Create and manage categories
- Many-to-many relationship with posts
- Category-based filtering
- Unique name validation

### Dashboard Interface
- Overview statistics
- Quick actions
- Post management
- Category management

### Public Interface
- Responsive blog listing
- Individual post pages
- Category filtering
- Clean, modern design

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `DIRECT_URL`: Direct database connection (for migrations)
- `NEXT_PUBLIC_APP_URL`: Your production URL

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## 🔧 Development

### Adding New Features

1. Define types in `src/types/`
2. Create tRPC procedures in `src/server/api/routers/`
3. Build UI components in `src/components/`
4. Add pages in `src/app/`

### Database Changes

1. Update schema in `src/server/db/schema.ts`
2. Run `npm run db:push` to apply changes
3. Update types and queries as needed

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `src/app/globals.css` for global styles
- Customize shadcn/ui components in `src/components/ui/`

### Content
- Landing page content in `src/app/page.tsx`
- Dashboard content in `src/app/(dashboard)/`
- Public pages in `src/app/posts/`

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
