import { FileTextIcon } from "lucide-react"

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

export default function NoProjectFound({ children }: { children: React.ReactNode }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia className="rounded-full" variant="icon">
                    <FileTextIcon size={18} />
                </EmptyMedia>
                <EmptyTitle>No Workflows Yet</EmptyTitle>
                <EmptyDescription>
                    You haven't created any workflows yet. Get started by creating
                    your first workflow.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                {children}
            </EmptyContent>
        </Empty>

    )
}
