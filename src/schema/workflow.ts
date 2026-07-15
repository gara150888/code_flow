import { z } from "zod";

export const workflowSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Workflow name is required"),

    description: z.string().trim().optional(),

    definition: z.string().optional(),

    status: z
        .enum(["draft", "published", "archived"])
        .optional(),
});