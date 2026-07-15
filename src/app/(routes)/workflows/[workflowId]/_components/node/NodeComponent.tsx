import { TaskRegistry } from "@/workflow/task/registry";
import type { AppNodeData } from "@/types/appnode";
import type { NodeProps } from "@xyflow/react";
import { memo } from "react";

import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import NodeInputs from "./NodeInputs";
import NodeInput from "./NodeInput";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

const NodeComponent = memo((props: NodeProps) => {
    const nodeData = props.data as AppNodeData;
    const task = TaskRegistry[nodeData.type];

    return (
        <NodeCard isSelected={!!props.selected} nodeId={props.id}>
            <NodeHeader nodeId={props.id} taskType={nodeData.type} />
            <NodeInputs>
                {task?.inputs?.map((input, index) => (
                    <NodeInput isEntryPoint={task.isEntryPoint} key={index} input={input} nodeId={props.id} />
                ))}
            </NodeInputs>

            <NodeOutputs>
                {task?.outputs?.map((output, index) => (
                    <NodeOutput key={index} output={output} />
                ))}
            </NodeOutputs>
        </NodeCard>
    );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
