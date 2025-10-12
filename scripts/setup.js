#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Blogify...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Set up your Supabase project at https://supabase.com');
console.log('2. Update the environment variables in .env.local');
console.log('3. Enable Google OAuth in your Supabase project');
console.log('4. Run: npm run db:push');
console.log('5. Run: npm run dev');
console.log('\n🎉 Happy blogging!');
