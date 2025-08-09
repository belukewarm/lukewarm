"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "ghost" | "secondary";
  size?: "sm" | "md";
  className?: string;
};

export function Button({asChild, variant="default", size="md", className="", ...props}: ButtonProps) {
  const Comp: any = asChild ? Slot : "button";
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition";
  const variants = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800",
    ghost: "bg-transparent hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
  };
  const sizes = { sm: "h-8 px-3", md: "h-10 px-4" };
  return <Comp className={[base, variants[variant], sizes[size], className].join(" ")} {...props} />;
}
