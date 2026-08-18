import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { chat, clearSession, getToken, getUsername } from "@/lib/labs-api";
import { RagIngest } from "@/components/RagIngest";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistente de IA e RAG — Prof. Anderson Labs" },
      {
        name: "description",
        content:
          "Converse com o assistente de IA das aulas e alimente a base de conhecimento (RAG) com novos documentos.",
      },
      { property: "og:title", content: "Assistente de IA e RAG — Prof. Anderson Labs" },
      {
        property: "og:description",
        content: "Chat com IA e ingestão de documentos para a base vetorial das aulas.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; text: string };

function ChatPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      navigate({ to: "/login" });
      return;
    }
    setUser(getUsername());
    setReady(true);
  }, [navigate]);

  if (!ready) return null;

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8 px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="inline-block rounded-full border border-border bg-input px-3 py-1 text-xs uppercase tracking-widest text-primary">
            Assistente das aulas
          </p>
          <h1 className="text-4xl font-semibold">Fale com o @Coder</h1>
          <p className="text-muted-foreground">
            Conectado como <strong className="text-foreground">{user}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearSession();
            navigate({ to: "/login" });
          }}
          className="glass px-5 py-2.5 text-sm transition-colors hover:border-primary/50"
        >
          Sair
        </button>
      </div>

      <ChatBox />
      <RagIngest />

      <p className="text-sm text-muted-foreground">
        Voltar para{" "}
        <Link to="/" className="text-primary underline-offset-4 hover:underline">
          a página inicial
        </Link>
        .
      </p>
    </section>
  );
}

function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || busy) return;
    setPrompt("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setBusy(true);
    try {
      const answer = await chat(text);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao consultar a IA.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass space-y-4 px-6 py-6">
      <h2 className="text-xl font-semibold">Conversa</h2>

      <div className="max-h-[420px] min-h-[220px] space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Faça uma pergunta sobre Docker, SQL, redes, DevOps ou qualquer conteúdo já indexado.
          </p>
        ) : null}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  : "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {busy ? <p className="text-sm text-muted-foreground">Pensando...</p> : null}
        <div ref={endRef} />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <form onSubmit={send} className="flex flex-wrap gap-3">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Digite sua pergunta..."
          className="min-w-0 flex-1 rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl border border-primary/40 bg-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/30 disabled:opacity-60"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
