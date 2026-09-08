import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getMessages, sendMessage } from "@/lib/server/app";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COACH } from "@/lib/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/app/messages")({ component: Messages });

function Messages() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["messages"], queryFn: () => getMessages() });
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!body.trim()) return;
    setBusy(true);
    try {
      await sendMessage({ data: { body } });
      setBody("");
      await qc.invalidateQueries({ queryKey: ["messages"] });
    } catch {
      toast.error("Could not send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70dvh] flex-col px-5 py-8 md:px-0">
      <div className="flex items-center gap-3">
        <img src={COACH.image} alt="" className="size-12 rounded-full object-cover" />
        <div>
          <h1 className="font-display text-2xl">{COACH.name}</h1>
          <p className="text-xs text-subtle">Usually replies on check-in days</p>
        </div>
      </div>
      <div className="mt-8 flex flex-1 flex-col gap-4">
        {(q.data ?? []).length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
        {(q.data ?? []).map((m) => (
          <div
            key={m.id}
            className={`max-w-[36rem] rounded-lg px-4 py-3 text-sm leading-relaxed ${
              m.from_role === "client" ? "ml-auto bg-surface" : "bg-bg-elevated"
            }`}
          >
            <p>{m.body}</p>
            <p className="mt-2 text-[10px] tracking-[0.12em] text-subtle uppercase">
              {format(new Date(m.created_at), "d MMM, HH:mm")}
            </p>
          </div>
        ))}
      </div>
      <div className="sticky bottom-16 mt-6 flex flex-col gap-2 bg-bg pt-2 md:bottom-0">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write to Elena"
          className="min-h-24"
        />
        <Button onClick={send} disabled={busy || !body.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
