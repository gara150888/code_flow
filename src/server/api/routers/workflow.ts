import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { workflow } from "@/server/db/schema";
import { workflowSchema } from "@/schema/workflow";

import { CreateFlowNode } from "@/workflow/createFlowNode";
import type { AppNode } from "@/types/appnode";
import { TaskType } from "@/types/task";
import type { Edge } from "@xyflow/react";

import { z } from "zod";
import { and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const workflowRouter = createTRPCRouter({
    create: protectedProcedure
        .input(workflowSchema)
        .mutation(async ({ ctx, input }) => {

            const initialFlow: { nodes: AppNode[], edges: Edge[] } = {
                nodes: [],
                edges: []
            };

            initialFlow.nodes.push(CreateFlowNode(TaskType.INITIALIZE_CHAT))

            const [newWorkflow] = await db
                .insert(workflow)
                .values({
                    id: uuid(),
                    userId: ctx.user.id,
                    name: input.name,
                    status: input.status ?? "draft",
                    definition: JSON.stringify(initialFlow),
                    description: input.description
                })
                .returning();
            return newWorkflow;
        }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const workflow = await db.query.workflow.findMany({
            where: (workflow, { eq }) => eq(workflow.userId, ctx.user.id),
        });
        if (workflow.length === 0) return null;
        return workflow;
    }),
    getById: protectedProcedure
        .input(z.object({
            id: z.string().uuid()
        }))
        .query(async ({ ctx, input }) => {
            const [workflow] = await db.query.workflow.findMany({
                where: (workflow, { and, eq }) => and(
                    eq(workflow.userId, ctx.user.id),
                    eq(workflow.id, input.id)
                )
            });
            return workflow || null;
        }),
    delete: protectedProcedure
        .input(z.object({
            id: z.string().uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            await db.delete(workflow).where(
                and(
                    eq(workflow.userId, ctx.user.id),
                    eq(workflow.id, input.id)
                )
            );
            return { success: true };
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                definition: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [existingWorkflow] = await db.query.workflow.findMany({
                where: (workflow, { and, eq }) =>
                    and(
                        eq(workflow.userId, ctx.user.id),
                        eq(workflow.id, input.id)
                    ),
            });

            if (!existingWorkflow) return null;
            if (existingWorkflow.status !== "draft") return null;

            await db
                .update(workflow)
                .set({ definition: input.definition })
                .where(eq(workflow.id, input.id));

            revalidatePath(`/workflows/`);

            return existingWorkflow;
        }),
});