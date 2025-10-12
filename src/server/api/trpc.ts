import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/server/db';

const t = initTRPC.context<{
  db: typeof db;
  supabase: Awaited<ReturnType<typeof createClient>>;
}>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const { data: { user }, error } = await ctx.supabase.auth.getUser();
  
  if (error || !user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
