import { cn } from "@/lib/utils";
import type { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import type { ReactNode } from "react";
import { ColorForHandle } from "./common";

interface NodeOutputsProps {
    children: ReactNode;
}

export function NodeOutputs({ children }: NodeOutputsProps) {
    return <div className="flex flex-col gap-1 divide-y">{children}</div>;
}

export function NodeOutput({ output }: { output: TaskParam }) {
    return (
        <div className="bg-secondary relative flex justify-end p-3">
            <p className="text-muted-foreground text-xs">{output.name}</p>
            <Handle
                className={cn(
                    ColorForHandle[output.type],
                    " boder-2! border-background! h-4! w-4!",
                )}
                id={output.name}
                type="source"
                position={Position.Right}
            />
        </div>
    );
}
