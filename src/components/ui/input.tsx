import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
    {...props}
  />
));

Input.displayName = "Input";
