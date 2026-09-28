import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[7px] border text-sm font-semibold transition-[transform,box-shadow,background-color,border-color,color] duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary px-4 text-white shadow-[0_8px_22px_rgb(22_131_255_/_18%)] hover:bg-primary-hover hover:shadow-[0_10px_28px_rgb(22_131_255_/_28%)]",
        outline: "border-border bg-surface px-4 text-foreground hover:border-border-strong hover:bg-surface-raised",
        ghost: "border-transparent px-3 text-muted-foreground hover:bg-surface-raised hover:text-foreground",
      },
      size: {
        default: "h-10",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
