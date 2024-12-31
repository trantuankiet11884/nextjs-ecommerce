"use client";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2Icon } from "lucide-react";
export default function DeleteDialog({
  id,
  action,
  callbackAction,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
  callbackAction?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="error">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc muốn xóa sản phẩm đã chọn?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-red-500">
              Bạn không thể khôi phục lại sản phẩm đã xóa
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const res = await action(id);
                if (!res.success) {
                  toast({
                    variant: "destructive",
                    description: res.message,
                  });
                } else {
                  setOpen(false);
                  toast({
                    description: res.message,
                  });
                  if (callbackAction) callbackAction();
                }
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
              "Xóa"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
