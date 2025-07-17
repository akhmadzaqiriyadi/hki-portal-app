import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  // Base styles: Menghapus border-transparent agar bisa di-override oleh varian
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow,background-color,border-color] overflow-hidden",
  {
    variants: {
      variant: {
        // Varian default & outline tetap sama untuk kegunaan umum
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        
        // --- Perubahan untuk Varian Status ---

        // Secondary: Untuk status netral atau default
        secondary:
          "bg-muted border-transparent text-muted-foreground [a&]:hover:bg-muted/80",

        // Destructive: Untuk status "revisi"
        destructive:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 [a&]:hover:bg-red-100/80 dark:[a&]:hover:bg-red-900/40",

        // Warning: Untuk status "submitted"
        warning:
          "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50 [a&]:hover:bg-yellow-100/80 dark:[a&]:hover:bg-yellow-900/40",

        // Success: Untuk status "approved"
        success:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 [a&]:hover:bg-green-100/80 dark:[a&]:hover:bg-green-900/40",

        // Info: Untuk status "diproses_hki"
        info:
          "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 [a&]:hover:bg-blue-100/80 dark:[a&]:hover:bg-blue-900/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// --- Tidak ada perubahan pada bagian di bawah ini ---
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };