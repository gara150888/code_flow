import React from 'react'

interface NodeInputsProps {
    children: React.ReactNode
}

const NodeInputs = ({ children }: NodeInputsProps) => {
    return (
        <div className="flex flex-col divide-y gap-2">{children}</div>
    )
}

export default NodeInputs