import React, { useState, useMemo } from "react";
import { Eye, EyeOff, Check, X, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PasswordCriteria {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordFieldProps {
  field: any;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const passwordCriteria: PasswordCriteria[] = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    test: (password) => /\d/.test(password),
  },
];

const PasswordFieldWithTooltip: React.FC<PasswordFieldProps> = ({
  field,
  label = "Password",
  placeholder = "Enter password",
  required = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const password = field.state.value || "";

  const criteriaStatus = useMemo(() => {
    return passwordCriteria.map((criterion) => ({
      ...criterion,
      satisfied: criterion.test(password),
    }));
  }, [password]);

  const allCriteriaSatisfied = useMemo(() => {
    return criteriaStatus.every((criterion) => criterion.satisfied);
  }, [criteriaStatus]);

  const shouldShowTooltip =
    isFocused && password.length > 0 && !allCriteriaSatisfied;

  return (
    <div className="">
      <Label htmlFor="password" className="mb-1 font-normal text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Tooltip open={shouldShowTooltip}>
        <TooltipTrigger asChild>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              value={password}
              onChange={(e) => {
                const value = e.target.value.trim();
                field.setValue(value);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`pr-10 ${showPassword ? "font-light" : "font-bold"} md:text-base placeholder:font-light placeholder:text-sm focus-visible:ring-0`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye className="w-4 h-4 text-gray-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="right"
          align="start"
          className="w-52 p-4 bg-white border shadow-lg"
          sideOffset={8}
        >
          <div className="space-y-2">
            <p className="text-sm font-semibold flex gap-1 items-center text-gray-700 mb-3">
              <Info className="w-4 h-4 text-gray-600 flex-shrink-0" /> Password
              must contain:
            </p>
            {criteriaStatus.map((criterion, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm transition-colors"
              >
                {criterion.satisfied ? (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span
                  className={`${
                    criterion.satisfied
                      ? "text-green-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {criterion.label}
                </span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>

      {field?.state?.meta?.errorMap?.onSubmit && (
        <p className="text-red-500 px-1 text-xs mt-1">
          {Array.isArray(field?.state?.meta?.errorMap?.onSubmit)
            ? field?.state?.meta?.errorMap?.onSubmit[0]
            : field?.state?.meta?.errorMap?.onSubmit}
        </p>
      )}
    </div>
  );
};

export default PasswordFieldWithTooltip;
