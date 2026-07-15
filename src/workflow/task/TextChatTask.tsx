import { TaskParamType, TaskType } from "@/types/task";
import type { LucideProps } from "lucide-react";
import { GlobeIcon } from "lucide-react";

export const TextChatTask = {
    type: TaskType.TEXT_CHAT,
    label: "Text Chat",
    description: "Launches a web browser to navigate to a specified URL",
    icon: (props: LucideProps) => (
        <GlobeIcon className="stroke-primary" {...props} />
    ),
    isEntryPoint: false,
    inputs: [
        {
            name: "Prompt",
            type: TaskParamType.STRING,
            helperText: "eg: hey gpt can you do this for me ?",
            isRequired: true,
            hideHandle: false,
        },
    ],
    outputs: [
        {
            name: "Gpt Response",
            type: TaskParamType.STRING,
        },
    ],
};
