import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  session: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
});
