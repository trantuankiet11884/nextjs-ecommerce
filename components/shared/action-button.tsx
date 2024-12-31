"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
export default function ActionButton({
  caption,
  action,
  className = "w-full",
  variant = "default",
  size = "default",
}: {
  caption: string;
  action: () => Promise<{ success: boolean; message: string }>;
  className?: string;
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm" | "lg";
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <Button
      type="button"
      className={cn("rounded-full", className)}
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await action();
          toast({
            variant: res.success ? "default" : "destructive",
            description: res.message,
          });
        })
      }
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
      ) : (
        caption
      )}
    </Button>
  );
}
