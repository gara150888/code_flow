import { cn } from "@/lib/utils";
import type { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ColorForHandle } from "./common";
import NodeParamField from "./NodeParamField";

interface NodeInputProps {
    isEntryPoint: boolean;
    input: TaskParam;
    nodeId: string;
}

const NodeInput = ({ isEntryPoint, input, nodeId }: NodeInputProps) => {
    const edges = useEdges();
    const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === input.name);

    return (
        <div className="bg-secondary relative flex w-full justify-start p-3">
            <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
            {!isEntryPoint && !input.hideHandle && (
                <Handle
                    id={input.name}
                    type="target"
                    isConnectable={!isConnected}
                    position={Position.Left}
                    className={cn(
                        ColorForHandle[input.type],
                        "border-background! h-4! w-4! border-2!",
                    )}
                />
            )}
        </div>
    );
};

export default NodeInput;
