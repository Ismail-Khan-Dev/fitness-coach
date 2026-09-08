import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  children,
  side = "right",
  className,
  title,
}: {
  children: ReactNode;
  side?: "right" | "left";
  className?: string;
  title: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in" />
      <Dialog.Content
        className={cn(
          "fixed top-0 z-50 flex h-dvh w-[min(100%,22rem)] flex-col bg-bg-elevated p-6 shadow-soft",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "data-[state=open]:translate-x-0",
          side === "right"
            ? "right-0 data-[state=closed]:translate-x-full"
            : "left-0 data-[state=closed]:-translate-x-full",
          className,
        )}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        <Dialog.Close
          className="absolute top-4 right-4 grid size-11 place-items-center rounded-md text-muted hover:bg-surface hover:text-fg"
          aria-label="Close"
        >
          <X className="size-5" />
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
