import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold font-display transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        nature: "border-transparent bg-category-nature/15 text-category-nature",
        food: "border-transparent bg-category-food/15 text-category-food",
        culture: "border-transparent bg-category-culture/15 text-category-culture",
        adventure: "border-transparent bg-category-adventure/15 text-category-adventure",
        historical: "border-transparent bg-category-historical/15 text-category-historical",
        points: "border-transparent bg-accent text-accent-foreground shadow-glow",
        streak: "border-transparent gradient-sunset text-primary-foreground",
        level: "border-transparent gradient-ocean text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
