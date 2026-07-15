"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/workflow/task/registry'
import { TaskType } from '@/types/task'
import React from 'react'

const TaskMenu = () => {
    return (
        <aside className='w-75 min-w-75 max-w-75 border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
            <Accordion defaultValue={["extraction"]} className="w-full">
                <AccordionItem value="extraction">
                    <AccordionTrigger className="font-bold">Data Extraction</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1">
                        <TaskMenuBtn taskType={TaskType.TEXT_CHAT} />
                        <TaskMenuBtn taskType={TaskType.TEXT_TO_IMAGE} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    )
}

export default TaskMenu

const TaskMenuBtn = ({ taskType }: { taskType: TaskType }) => {
    const task = TaskRegistry[taskType]!

    const onDragStart = (event: React.DragEvent, type: TaskType) => {
        event.dataTransfer.setData("application/reactflow", type)
        event.dataTransfer.effectAllowed = "move"
    }

    return (
        <Button
            draggable
            onDragStart={(event) => onDragStart(event, task.type)}
            variant={"secondary"} className={"flex justify-between items-center gap-2 border w-full"}>
            <task.icon size={20} />
            {task.label}
        </Button>
    )
}
