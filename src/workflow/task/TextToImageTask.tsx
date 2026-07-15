import { TaskParamType, TaskType } from "@/types/task";
import type { LucideProps } from "lucide-react";
import { Image } from "lucide-react";

export const TextToImageTask = {
    type: TaskType.TEXT_TO_IMAGE,
    label: "Text To Image",
    description: "Generate an image from a text prompt",
    icon: (props: LucideProps) => (
        <Image className="stroke-rose-500" {...props} />
    ),
    isEntryPoint: false,
    inputs: [
        {
            name: "Prompt",
            type: TaskParamType.STRING,
            helperText: "eg: A photorealistic image of an astronaut riding a horse on the moon.",
            isRequired: true,
            hideHandle: false,
        },
    ],
    outputs: [
        {
            name: "Image",
            type: TaskParamType.STRING,
        },
    ],
};
