import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,border-color,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-fg hover:bg-primary/90",
        bone: "bg-primary text-primary-fg hover:bg-primary/90",
        secondary:
          "border border-border-strong bg-transparent text-fg hover:bg-surface",
        ghost: "text-fg hover:bg-surface",
        outline:
          "border border-border text-fg hover:border-border-strong hover:bg-surface",
        accent: "bg-accent text-accent-fg hover:bg-accent/90",
        danger: "bg-danger text-primary hover:bg-danger/90",
        link: "text-fg underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        sm: "h-9 rounded-md px-3.5 text-sm",
        md: "h-11 rounded-md px-5 text-sm",
        lg: "h-12 rounded-lg px-6 text-[15px]",
        xl: "h-14 rounded-lg px-8 text-base",
        icon: "size-11 rounded-md",
        "icon-sm": "size-9 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- intentional CVA re-export
export { buttonVariants };
