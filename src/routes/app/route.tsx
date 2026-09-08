import { createFileRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AppShell } from "@/components/app/shell";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <AppShell />
    </QueryClientProvider>
  );
}

export function AppQuery({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
