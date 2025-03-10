"use client";

import { Label } from "@/components/ui/label";
import { Switch as SwitchComponent } from "@/components/ui/switch";
import { useId, useState } from "react";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export default function Switch({
  checked: controlledChecked,
  onCheckedChange,
  disabled,
  className = "",
  "aria-label": ariaLabel,
}: SwitchProps) {
  const id = useId();
  const [internalChecked, setInternalChecked] = useState<boolean>(true);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleCheckedChange = (value: boolean) => {
    if (!isControlled) {
      setInternalChecked(value);
    }
    if (onCheckedChange) {
      onCheckedChange(value);
    }
  };

  return (
    <div className={className}>
      <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <SwitchComponent
          id={id}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          aria-label={ariaLabel}
          className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto rounded-md [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
          <span className="text-[10px] font-medium uppercase">Off</span>
        </span>
        <span className="min-w-78flex peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
          <span className="text-[10px] font-medium uppercase">On</span>
        </span>
      </div>
      <Label htmlFor={id} className="sr-only">
        {ariaLabel || "Labeled switch"}
      </Label>
    </div>
  );
}
