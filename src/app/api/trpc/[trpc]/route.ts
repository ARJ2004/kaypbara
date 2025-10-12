import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../../server/api/root';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/server/db';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      const supabase = await createClient();
      return {
        db,
        supabase,
      };
    },
  });

export { handler as GET, handler as POST };
