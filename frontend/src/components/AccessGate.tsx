/* Style reminder: preserve the existing holographic glass surfaces, prism cyan accents, rounded pills, and compact motion vocabulary. */
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getToken, getUsername } from "@/lib/labs-api";

export function AccessGate({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      navigate({ to: "/login" });
      return;
    }
    setUsername(getUsername());
    setReady(true);
  }, [navigate]);

  if (!ready) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <span className="glass self-start rounded-full px-4 py-2 text-xs text-muted-foreground sm:self-auto">
          Sessão: <strong className="text-foreground">{username ?? "usuário"}</strong>
        </span>
      </div>
      {children}
    </section>
  );
}
