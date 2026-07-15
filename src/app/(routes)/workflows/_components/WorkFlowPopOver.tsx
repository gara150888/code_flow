"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea, } from "@/components/ui/input-group";

import { workflowSchema } from "@/schema/workflow";

import { api } from "@/trpc/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof workflowSchema>;

export default function WorkFlowPopOver({ setWorkFlowModal }: { setWorkFlowModal: (open: boolean) => void }) {
    const utils = api.useUtils();
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(workflowSchema),
        defaultValues: {
            name: "",
            description: "",
            definition: "",
            status: "draft",

        },
        mode: "onSubmit",
    });

    const createWorkflowMutation = api.workflow.create.useMutation({
        onSuccess: async (workflow) => {
            setWorkFlowModal(false)
            form.reset();
            await utils.workflow.getAll.invalidate();
            router.push(`/workflows/${workflow?.id}`);
            toast.success("Workflow created successfully", { id: "create-workflow" });
        },
        onError: (err) => {
            toast.error(err.message, { id: "create-workflow" });
        },
    });

    const onSubmit = (data: FormValues) => {
        toast.loading("Please wait for while creating workflow...", { id: "create-workflow" })
        createWorkflowMutation.mutate(data)
    };

    return (
        <Card className="w-full max-w-lg gap-y-2">
            <CardHeader className="flex flex-col items-center gap-0">
                <img className="w-16" src="https://i.ibb.co/9H9mvfCd/image.png" alt="Workflow" />
                <h2 className="text-xl font-semibold">
                    Create Workflow
                </h2>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">
                                        Workflow Title{" "}
                                        <span className="text-xs text-primary">
                                            (required)
                                        </span>
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="name"
                                        value={field.value ?? ""}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="My First Workflow"
                                    />

                                    {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}

                                    <FieldDescription>
                                        Give your workflow a unique name.
                                    </FieldDescription>
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="description">
                                        Description{" "}
                                        <span className="text-xs text-muted-foreground">
                                            (optional)
                                        </span>
                                    </FieldLabel>

                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="description"
                                            value={field.value ?? ""}
                                            rows={6}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Describe what this workflow does..."
                                        />
                                    </InputGroup>

                                    <FieldDescription>
                                        Explain what this workflow is used for.
                                    </FieldDescription>

                                    {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={createWorkflowMutation.isPending}
                    >
                        {createWorkflowMutation.isPending
                            ? "Creating..."
                            : "Create New Workflow"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}