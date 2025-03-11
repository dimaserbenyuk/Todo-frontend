"use client";

import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    // Применяем разные стили для варианта
    let variantClasses = "";

    switch (variant) {
      case "destructive":
        variantClasses = "bg-red-500 text-white hover:bg-red-600";
        break;
      case "outline":
        variantClasses = "border border-gray-300 text-gray-700 hover:bg-gray-100";
        break;
      case "ghost":
        variantClasses = "hover:bg-gray-100 text-gray-700";
        break;
      default:
        // "default"
        variantClasses = "bg-blue-500 text-white hover:bg-blue-600";
        break;
    }

    return (
      <button
        ref={ref}
        className={`rounded-md px-4 py-2 font-medium transition-colors ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
