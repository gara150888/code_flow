import { ItemGroup } from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-row items-center justify-between gap-4 py-6 px-12 h-20">
                <div>
                    <h1 className="text-2xl font-bold">Workflows</h1>
                    <p className="text-muted-foreground">Create and manage your workflows</p>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-9 w-40" />
                </div>
            </div>
            <ItemGroup className="grid grid-cols-3 sm:grid-cols-2 gap-4 px-12 py-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-4 p-4 border rounded-lg">
                        <div className="flex flex-row items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex flex-col gap-2 flex-1">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between gap-4">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                ))}
            </ItemGroup>
        </div>
    )
}

export default Loading