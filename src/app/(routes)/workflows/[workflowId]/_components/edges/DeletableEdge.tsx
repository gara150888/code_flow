"use client";

import { Button } from "@/components/ui/button";
import {
    BaseEdge,
    EdgeLabelRenderer,
    type EdgeProps,
    getSmoothStepPath,
    useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";

export default function DeletableEdge(props: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath(props);
    const { setEdges } = useReactFlow();
    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={props.markerEnd}
                style={props.style}
            />

            <EdgeLabelRenderer>
                <div
                    className="bg-background"
                    style={{
                        position: "absolute",
                        transform: `translate(-50% , -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: "all",
                    }}
                >
                    <Button
                        className={"leading-none hover:shadow-lg"}
                        variant={"outline"}
                        size={"icon"}
                        onClick={() => {
                            setEdges((edges) => edges.filter((edge) => edge.id !== props.id))
                        }}
                    >
                        <X size={20} />
                    </Button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
