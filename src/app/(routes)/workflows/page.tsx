'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { api } from '@/trpc/react'
import { Search } from 'lucide-react'
import { useState } from 'react'
import NoProjectFound from './_components/NoProjectFound'
import WorkFlowCard from './_components/WorkFlowCard'
import WorkFlowPopOver from './_components/WorkFlowPopOver'
import { ItemGroup } from '@/components/ui/item'
import React from 'react'


const Page = () => {

    const [workflows] = api.workflow.getAll.useSuspenseQuery();
    const [workFlowModal, setWorkFlowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWorkflows = React.useMemo(() => {
        if (!workflows) return [];
        return workflows.filter((workflow) => workflow.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [workflows, searchQuery]);

    return (
        <div className='flex flex-col flex-1'>

            {!workflows ? <NoProjectFound /> :
                (
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center justify-between gap-4 py-6 px-12">
                            <div>
                                <h1 className="text-2xl font-bold">Workflows</h1>
                                <p className="text-muted-foreground">Create and manage your workflows</p>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <InputGroup className="max-w-sm">
                                    <InputGroupInput placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)} />
                                    <InputGroupAddon>
                                        <Search />
                                    </InputGroupAddon>
                                </InputGroup>
                                <Dialog open={workFlowModal} onOpenChange={setWorkFlowModal}>
                                    <DialogTrigger render={<Button>Create workflow</Button>} />
                                    <DialogContent className="p-0" showCloseButton={false}>
                                        <WorkFlowPopOver setWorkFlowModal={setWorkFlowModal} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 px-12 py-6">
                            <ItemGroup className="grid grid-cols-3 sm:grid-cols-2 gap-4 w-full">
                                {filteredWorkflows.map((workflow) => (
                                    <WorkFlowCard key={workflow.id} workflow={workflow} />
                                ))}
                            </ItemGroup>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Page