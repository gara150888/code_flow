
export enum TaskType {
    INITIALIZE_CHAT = "INITIALIZE_CHAT",
    TEXT_CHAT = "TEXT_CHAT",
    TEXT_TO_IMAGE = "TEXT_TO_IMAGE"
}

export enum TaskParamType {
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    [key: string]: any;
}
