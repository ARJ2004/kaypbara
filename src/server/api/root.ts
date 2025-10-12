import { router } from './trpc';
import { postRouter } from './routers/post';
import { categoryRouter } from './routers/category';
import { userRouter } from './routers/user';

export const appRouter = router({
  post: postRouter,
  category: categoryRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
