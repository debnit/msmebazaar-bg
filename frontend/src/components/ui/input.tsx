/**
 * components/ui/input.tsx
 * Reusable Input component with label, error, and variants
 */
import React, { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

export type InputVariant = "default" | "ghost" | "outline";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  variant?: InputVariant;
  wrapperClassName?: string;
}

const variantClasses: Record<InputVariant, string> = {
  default: "border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
  ghost: "bg-transparent border-0 focus:ring-0",
  outline: "border border-gray-200 focus:border-indigo-500 rounded-lg",
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, variant = "default", wrapperClassName, className, ...rest } = props;

  return (
    <div className={clsx("w-full", wrapperClassName)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        ref={ref}
        className={clsx(
          "w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400",
          variantClasses[variant],
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
