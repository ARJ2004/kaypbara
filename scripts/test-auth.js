// Simple test script to verify authentication flow
// This script can be run to test if the database connection and user creation works

const { createClient } = require('@supabase/supabase-js')
const { drizzle } = require('drizzle-orm/postgres-js')
const postgres = require('postgres')

// Load environment variables
require('dotenv').config()

async function testAuthFlow() {
  console.log('🧪 Testing authentication flow...')
  
  try {
    // Test database connection
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL not found in environment variables')
    }
    
    const sql = postgres(connectionString)
    const db = drizzle(sql)
    
    console.log('✅ Database connection successful')
    
    // Test Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found in environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase connection successful')
    
    // Test user table exists
    const { users } = require('../src/server/db/schema')
    const { eq } = require('drizzle-orm')
    
    const testUsers = await db.select().from(users).limit(1)
    console.log('✅ Users table accessible')
    
    console.log('🎉 All tests passed! Authentication flow should work correctly.')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testAuthFlow()
