import { cn } from '@/lib/utils';
import { Handle, Position, useReactFlow } from '@xyflow/react'
import React from 'react'

interface NodeCardProps {
    children: React.ReactNode;
    nodeId: string;
    isSelected: boolean;
}

const NodeCard = ({ children, nodeId, isSelected }: NodeCardProps) => {
    const { getNode, setCenter } = useReactFlow()

    return (
        <div className={cn(
            'rounded-md cursor-pointer bg-background border-2 border-seprate w-[420px] text-xs gap-1 flex flex-col ',
            isSelected && 'border-primary'
        )}
            onDoubleClick={() => {
                const node = getNode(nodeId);
                if (!node) return null
                const { position, measured } = node
                if (!position || !measured) return
                const { width, height } = measured
                const x = position.x + width! / 2
                const y = position.y + height! / 2
                if (x === undefined || y === undefined) return
                setCenter(x, y, {
                    zoom: 1,
                    duration: 500
                })
            }} >{children}</div>
    )
}

export default NodeCard