'use client'

import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [
    {
        id: 'any',
        source: 'n1',
        target: 'n2'
    }];

import React from 'react'
import type { workflow } from '@/server/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

type Workflow = InferSelectModel<typeof workflow>

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );


    return (
        <div className="flex flex-1 flex-col">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls position="top-left" />
                <Background variant={BackgroundVariant.Dots} gap={10} />
            </ReactFlow>
        </div>
    )
}

export default FlowEditor