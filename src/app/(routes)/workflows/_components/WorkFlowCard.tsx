import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import type { workflow as WorkflowSchema } from '@/server/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, Trash } from 'lucide-react'

import ToolTipWrapper from '@/components/ui/ToolTipWrapper'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import DeleteWorkFlowDialog from './DeleteWorkFlowDialog'
import { useRouter } from 'next/navigation'

type Workflow = InferSelectModel<typeof WorkflowSchema>

const WorkFlowCard = ({ workflow }: { workflow: Workflow }) => {
    const router = useRouter();
    return (
        <Item key={workflow.id} variant="muted">
            <ItemMedia>
                <Avatar className="w-10 h-10">
                    <AvatarFallback className='capitalize text-sm'>{workflow.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent className=''>
                <ItemTitle className="capitalize">{workflow.name}</ItemTitle>
                <ItemDescription>{workflow.description || 'No description'}</ItemDescription>
            </ItemContent>
            <ItemActions className='flex flex-row gap-0.5 items-center'>
                <WrapFlowActions name={workflow.name} workFlowId={workflow.id} />
                <Button onClick={() => router.push(`/workflows/${workflow.id}`)} variant="ghost" size="icon" className="rounded-full">
                    <ChevronRightIcon />
                </Button>
            </ItemActions>
        </Item>
    )
}


function WrapFlowActions({ name, workFlowId }: { name: string, workFlowId: string }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    return (
        <>
            <DropdownMenu>
                <ToolTipWrapper content="More Actions">
                    <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                        </Button>}
                    />
                </ToolTipWrapper>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        variant="destructive" >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            <DeleteWorkFlowDialog
                workFlowId={workFlowId}
                showDeleteDialog={showDeleteDialog}
                setShowDeleteDialog={setShowDeleteDialog}
                name={name}
            />
        </>
    )
}

export default WorkFlowCard