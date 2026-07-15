import React from 'react'
import type { workflow } from '@/server/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from "./FlowEditor";
import TaskMenu from './TaskMenu';

type Workflow = InferSelectModel<typeof workflow>

const Editor = ({ workflow }: { workflow: Workflow }) => {
    return (
        <ReactFlowProvider>
            <div className="flex h-full w-full flex-col overflow-hidden">
                {/* <Topbar
                    title={workflow.name}
                    subtitle={workflow?.description ?? ""}
                    workflowId={workflow.id}
                /> */}
                <section className="flex h-full overflow-auto">
                    <TaskMenu />
                    <FlowEditor workflow={workflow} />
                </section>
            </div>
        </ReactFlowProvider>
    )
}

export default Editor