"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { LockIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePasswordStrength } from "@/hooks/use-password-strength";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  showStrengthIndicator?: boolean;
  error?: string;
}

export function PasswordInput({
  label = "Senha",
  showStrengthIndicator = true,
  className,
  error,
  value = "",
  ...props
}: PasswordInputProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const debouncedValue = useDebounce(value as string, 300);

  const { strength, strengthScore, getStrengthColor, getStrengthText } =
    usePasswordStrength(debouncedValue);

  return (
    <div className="grid w-full gap-1.5">
      {label && (
        <Label htmlFor={id} className="text-foreground font-medium">
          {label}
        </Label>
      )}
      <div className="relative w-full">
        <LockIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          className={cn(
            "h-10 pr-9 pl-9",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="••••••••"
          value={value}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
          aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
          disabled={props.disabled}
        >
          {isVisible ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-500">
          {error}
        </p>
      )}

      {showStrengthIndicator && value && (
        <div className="mt-2">
          <div
            className="h-1 w-full overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
          >
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out",
                getStrengthColor(),
              )}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-sm font-medium text-gray-600">
            {getStrengthText()}
          </p>

          <ul className="mt-2 space-y-1">
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? (
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XIcon className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    req.met ? "text-emerald-600" : "text-red-500",
                  )}
                >
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
