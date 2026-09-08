import * as Acc from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  className,
}: {
  items: { id: string; q: string; a: ReactNode }[];
  className?: string;
}) {
  return (
    <Acc.Root type="single" collapsible className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <Acc.Item key={item.id} value={item.id}>
          <Acc.Header>
            <Acc.Trigger className="flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] text-fg transition-colors hover:text-primary [&[data-state=open]>svg]:rotate-180">
              <span className="font-display text-xl tracking-tight">{item.q}</span>
              <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-200" />
            </Acc.Trigger>
          </Acc.Header>
          <Acc.Content className="overflow-hidden data-[state=closed]:animate-none">
            <div className="pb-6 text-[15px] leading-relaxed text-muted">{item.a}</div>
          </Acc.Content>
        </Acc.Item>
      ))}
    </Acc.Root>
  );
}
