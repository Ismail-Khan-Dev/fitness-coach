import * as D from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({
  children,
  className,
  title,
  description,
}: {
  children: ReactNode;
  className?: string;
  title: string;
  description?: string;
}) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-bg/75" />
      <D.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,32rem)] -translate-x-1/2 -translate-y-1/2",
          "rounded-xl border border-border bg-bg-elevated p-6 shadow-soft",
          className,
        )}
      >
        <D.Title className="font-display text-2xl text-fg">{title}</D.Title>
        {description ? (
          <D.Description className="mt-2 text-sm text-muted">{description}</D.Description>
        ) : (
          <D.Description className="sr-only">{title}</D.Description>
        )}
        <D.Close
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-md text-muted hover:bg-surface hover:text-fg"
          aria-label="Close"
        >
          <X className="size-5" />
        </D.Close>
        <div className="mt-5">{children}</div>
      </D.Content>
    </D.Portal>
  );
}
