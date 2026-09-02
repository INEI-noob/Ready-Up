import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-6 w-6 shrink-0 rounded-full border-2 border-pastelPink/40 transition-all duration-300",
      "hover:border-pastelPink hover:shadow-[0_0_8px_rgba(255,182,217,0.3)]",
      "data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-pastelPink data-[state=checked]:to-pastelLavender data-[state=checked]:border-transparent data-[state=checked]:shadow-pastel",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastelPink focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
