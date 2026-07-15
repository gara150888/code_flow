import type { Node } from "@xyflow/react"
import type { TaskType } from "./task"

export interface AppNodeData {
    type: TaskType
    inputs: Record<string, string>
    [key: string]: any
}

export interface AppNode extends Node {
    data: AppNodeData
}