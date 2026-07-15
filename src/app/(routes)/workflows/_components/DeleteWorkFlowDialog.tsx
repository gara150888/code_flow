'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import React from 'react';
import { toast } from 'sonner';

interface Props {
    name: string
    showDeleteDialog: boolean
    setShowDeleteDialog: (open: boolean) => void
    workFlowId: string
}

const DeleteWorkFlowDialog = ({ name, showDeleteDialog, setShowDeleteDialog, workFlowId }: Props) => {
    const utils = api.useUtils();
    const [inputValue, setInputValue] = React.useState("")

    const deleteWorkflow = api.workflow.delete.useMutation({
        onSuccess: async () => {
            await utils.workflow.getAll.invalidate();
            setInputValue("")
            setShowDeleteDialog(false)
            toast.success("Workflow deleted successfully", { id: "delete-workflow" })
        },
        onError: (err) => {
            toast.error(err.message, { id: "delete-workflow" })
        },
    })


    const handleDelete = async () => {
        toast.loading("Please wait for while deleting.", { id: "delete-workflow" })
        deleteWorkflow.mutate({ id: workFlowId })
        setShowDeleteDialog(false)
    }

    return (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger>
                <span className="hidden" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        If you delete this workflow, all of its data will be permanently deleted. Please type the "<span className="font-medium">{name}</span>" name to confirm.
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => inputValue === name && e.key === 'Enter' && handleDelete()}
                            placeholder={`Type "${name}" to confirm`}
                            className="mt-4"
                        />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={inputValue !== name || deleteWorkflow.isPending} onClick={handleDelete}>{deleteWorkflow.isPending ? 'Deleting...' : 'Continue'}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default DeleteWorkFlowDialog
