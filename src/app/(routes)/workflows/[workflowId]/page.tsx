import type { workflow } from "@/server/db/schema";
import { api } from "@/trpc/server";
import type { InferSelectModel } from "drizzle-orm";
import { notFound } from "next/navigation";
import Editor from "./_components/Editor";

type Workflow = InferSelectModel<typeof workflow>;

const Page = async ({ params }: { params: { workflowId: string } }) => {
    const workflow = (await api.workflow.getById({ id: params.workflowId })) as Workflow;

    if (!workflow) notFound();

    return (
        <div className="flex flex-1 flex-col">
            <Editor workflow={workflow} />
        </div>
    )
}

export default Page