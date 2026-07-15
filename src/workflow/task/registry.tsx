import { TaskType } from "@/types/task";
import { InitializeChatTask } from "@/workflow/task/InitializeChatTask";
import { TextChatTask } from "@/workflow/task/TextChatTask";
import { TextToImageTask } from "@/workflow/task/TextToImageTask";

export const TaskRegistry = {
    [TaskType.INITIALIZE_CHAT]: InitializeChatTask,
    [TaskType.TEXT_CHAT]: TextChatTask,
    [TaskType.TEXT_TO_IMAGE]: TextToImageTask,
}