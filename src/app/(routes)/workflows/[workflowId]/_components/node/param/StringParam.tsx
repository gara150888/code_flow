"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TaskParam } from "@/types/task";
import { useEffect, useId, useState } from "react";

const StringParam = ({
    param,
    value,
    disabled,
    updateNodeParamValue,
}: {
    param: TaskParam;
    value?: string;
    disabled: boolean;
    updateNodeParamValue: (newValue: string) => void;
}) => {
    const [internalValue, setInternalValue] = useState(value ?? "");
    const id = useId();

    useEffect(() => {
        setInternalValue(value ?? "");
    }, [value]);

    let Component: any = Input;

    if (param.variant === "textarea") {
        Component = Textarea;
    }

    return (
        <div className="w-full space-y-1 p-1">
            <Label htmlFor={id} className="text-muted-foreground flex text-xs font-medium">
                {param.name}
                {param.isRequired && <span className="px-2 text-red-500">*</span>}
            </Label>
            <Component
                id={id}
                value={internalValue}
                disabled={disabled}
                autoComplete="false"
                className="text-sm"
                placeholder="Enter value here"
                onChange={(e: any) => setInternalValue(e.target.value)}
                onBlur={(e: any) => updateNodeParamValue(e.target.value)}
            />
            {param.helperText && (<p className="text-muted-foreground px-2 text-xs">{param.helperText}</p>)}
        </div>
    );
};

export default StringParam;
