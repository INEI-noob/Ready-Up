import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full font-display font-extrabold tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        ready:
          "bg-gradient-to-r from-pastelPink via-pastelLavender to-pastelBlue text-white shadow-pastel-lg hover:-translate-y-0.5 hover:shadow-pink-glow active:scale-[0.97]",
        idle:
          "bg-white/60 text-inkDim border border-border cursor-not-allowed backdrop-blur-sm",
        ghost:
          "bg-transparent text-inkSoft hover:text-pastelPink hover:bg-pastelPink/10",
        cute:
          "bg-gradient-to-r from-pastelPink/80 to-pastelBlue/80 text-ink hover:from-pastelPink hover:to-pastelBlue shadow-pastel hover:-translate-y-0.5",
      },
      size: {
        lg: "h-14 px-8 text-lg w-full",
        md: "h-11 px-5 text-sm",
        sm: "h-9 px-4 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "idle",
      size: "lg",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
