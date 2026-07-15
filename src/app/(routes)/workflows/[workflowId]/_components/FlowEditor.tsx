'use client'

import { addEdge, Background, BackgroundVariant, Controls, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow, type Connection, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect } from 'react';

import type { workflow } from '@/server/db/schema';
import { api } from '@/trpc/react';
import type { AppNode } from '@/types/appnode';
import type { InferSelectModel } from 'drizzle-orm';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import NodeComponent from "./node/NodeComponent";
import { RemoveMark } from './RemoveMark';
import { CreateFlowNode } from '@/workflow/createFlowNode';
import type { TaskType } from '@/types/task';
import DeletableEdge from './edges/DeletableEdge'
import { TaskRegistry } from '@/workflow/task/registry';

type Workflow = InferSelectModel<typeof workflow>

const nodeTypes = {
    FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
    default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
    padding: 2,
};

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { theme } = useTheme();

    const { setViewport, toObject, screenToFlowPosition, updateNodeData, getNodes } = useReactFlow();

    const updateMutation = api.workflow.update.useMutation({
        onSuccess: () => { toast.success("Workflow updated", { id: "save-workflow" }); },
        onError: (err) => { toast.error(err.message, { id: "save-workflow" }); },
    });

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.shiftKey && e.key.toLowerCase() === "s") {
                e.preventDefault();
                toast.loading("Saving workflow...", { id: "save-workflow" });
                const flow = JSON.stringify(toObject());
                updateMutation.mutate({
                    id: workflow.id,
                    definition: flow,
                });
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [toObject, workflow.id, updateMutation]);

    RemoveMark()
    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition || "{}"); if (!flow) return;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            if (!flow.viewport) return;
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
        } catch (error) { }
    }, [workflow.definition, setEdges, setNodes, setViewport]);

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
            if (!connection.targetHandle) return;

            // remove input value if is present on connection
            const node = getNodes().find((nd) => nd.id === connection.target);
            if (!node) return;
            const nodeInputs = node.data.inputs || {};
            updateNodeData(node.id, {
                inputs: {
                    ...nodeInputs,
                    [connection.targetHandle]: "",
                },
            });
        },
        [setEdges, updateNodeData, getNodes],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const taskType = event.dataTransfer.getData("application/reactflow");
            if (typeof taskType === undefined || !taskType) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = CreateFlowNode(taskType as TaskType, position);
            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const isValidConnection = useCallback(
        (connection: Edge | Connection) => {

            if (connection.source === connection.target) return false;
            const source = nodes.find((node) => node.id === connection.source);
            const target = nodes.find((node) => node.id === connection.target);

            if (!source || !target) return false;
            const sourceTask = TaskRegistry[source.data.type];
            const targetTask = TaskRegistry[target.data.type];
            const output = sourceTask.outputs.find((o) => o.name === connection.sourceHandle);
            const input = targetTask.inputs.find((o) => o.name === connection.targetHandle);

            if (input?.type !== output?.type) return false;
            const hasCycle = (node: AppNode, visited = new Set()) => {
                if (visited.has(node.id)) return false;
                visited.add(node.id);

                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === connection.source) return true;
                    if (hasCycle(outgoer, visited)) return true;
                }
            };
            const detecedCycle = hasCycle(target);

            return !detecedCycle;
        },
        [nodes, edges],
    );


    return (
        <div className="flex flex-1 flex-col">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                className={theme === "dark" ? "dark" : ""}
                snapGrid={snapGrid}
                fitViewOptions={fitViewOptions}
                edgeTypes={edgeTypes}
                onDragOver={onDragOver}
                onDrop={onDrop}
                isValidConnection={isValidConnection}
            >
                <Controls position="top-left" />
                <Background variant={BackgroundVariant.Dots} gap={10} />
            </ReactFlow>
        </div>
    )
}

export default FlowEditor