import type { TaskParam } from "@/types/task";
import { TaskParamType } from "@/types/task";

import type { AppNode } from "@/types/appnode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
// import BrowserInstanceParam from "./param/BrowserInstanceParam";
import StringParam from "./param/StringParam";

const NodeParamField = ({
    param,
    nodeId,
    disabled,
}: {
    param: TaskParam;
    nodeId: string;
    disabled: boolean;
}) => {
    const { updateNodeData, getNode } = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data?.inputs?.[param.name];

    const updateNodeParamValue = useCallback(
        (newValue: string) => {
            updateNodeData(nodeId, (nodeData) => ({
                inputs: {
                    ...node?.data.inputs,
                    [param.name]: newValue,
                },
            }));
        },
        [nodeId, updateNodeData, param.name, node?.data.inputs],
    );

    switch (param.type) {
        case TaskParamType.STRING:
            return (
                <StringParam
                    param={param}
                    value={value}
                    disabled={disabled}
                    updateNodeParamValue={updateNodeParamValue}
                />
            );
        // case TaskParamType.BROWSER_INSTANCE:
        //     return (
        //         <BrowserInstanceParam
        //             param={param}
        //             value={""}
        //             updateNodeParamValue={updateNodeParamValue}
        //         />
        //     );

        default:
            return (
                <div className="w-full">
                    <p className="text-muted-foreground text-xs">Not implemented</p>
                </div>
            );
    }
};

export default NodeParamField;
