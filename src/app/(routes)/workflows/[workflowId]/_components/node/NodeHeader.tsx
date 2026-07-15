import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AppNode } from '@/types/appnode';
import type { TaskType } from "@/types/task";
import { CreateFlowNode } from '@/workflow/createFlowNode';
import { TaskRegistry } from '@/workflow/task/registry';
import { useReactFlow } from '@xyflow/react';
import { CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react';
import DeletableEdge from "../edges/DeletableEdge";


interface NodeHeaderProps {
    nodeId: string;
    taskType: TaskType;
}




const NodeHeader = ({ nodeId, taskType }: NodeHeaderProps) => {
    const task = TaskRegistry[taskType];
    const { deleteElements, getNode, addNodes } = useReactFlow();
    return (
        <div className="flex items-center gap-2 p-2">
            {task?.icon && <task.icon size={16} />}
            <div className="flex w-full items-center justify-between">
                <p className="text-muted-foreground text-sm font-bold uppercase">
                    {task?.label}
                </p>
                <div className="flex items-center gap-1">
                    {task?.isEntryPoint && <Badge>Entry Point</Badge>}
                    {(
                        <>
                            <Button
                                onClick={() => {
                                    deleteElements({ nodes: [{ id: nodeId }] });
                                }}
                                variant={"ghost"}
                            >
                                <TrashIcon size={20} />
                            </Button>
                            <Button
                                onClick={() => {
                                    const node = getNode(nodeId) as AppNode;
                                    const newX = node.position.x;
                                    const newY = node.position.y + node.measured?.height! + 20;
                                    const newNode = CreateFlowNode(node.data.type, {
                                        x: newX,
                                        y: newY,
                                    });
                                    addNodes([newNode]);
                                }}
                                variant={"ghost"}
                            >
                                <CopyIcon size={20} />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="drag-handle cursor-grab"
                    >
                        <GripVerticalIcon size={20} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NodeHeader