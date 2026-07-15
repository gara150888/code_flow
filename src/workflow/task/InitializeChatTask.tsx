import { TaskParamType, TaskType } from "@/types/task";
import type { LucideProps } from "lucide-react";
import { GlobeIcon } from "lucide-react";

export const InitializeChatTask = {
    type: TaskType.INITIALIZE_CHAT,
    label: "Initialize Chat",
    description: "Initializes a chat session with gpt",
    icon: (props: LucideProps) => (
        <GlobeIcon className="stroke-primary" {...props} />
    ),
    isEntryPoint: true,
    inputs: [
        {
            name: "System prompt",
            type: TaskParamType.STRING,
            helperText: "eg: who is rock?.",
            isRequired: true,
            hideHandle: false,
        }
    ],
    outputs: [
        {
            name: "Gpt Response",
            type: TaskParamType.STRING,
        },
    ],
};
