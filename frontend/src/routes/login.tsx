import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login, register } from "@/lib/labs-api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Prof. Anderson Labs" },
      {
        name: "description",
        content: "Acesse sua conta para usar o assistente de IA e a ingestão de documentos do RAG.",
      },
      { property: "og:title", content: "Entrar — Prof. Anderson Labs" },
      {
        property: "og:description",
        content: "Login dos alunos para o assistente de IA e a base de conhecimento.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setError(false);
    try {
      if (mode === "register") {
        const text = await register(username.trim(), password, email.trim(), telefone.trim());
        setMsg(text || "Usuário registrado com sucesso!");
        setMode("login");
      } else {
        await login(username.trim(), password);
        navigate({ to: "/visuallabs" });
      }
    } catch (err) {
      setError(true);
      setMsg(err instanceof Error ? err.message : "Falha na autenticação.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md px-5 py-20">
      <div className="glass space-y-6 px-6 py-8">
        <div className="space-y-2">
          <p className="inline-block rounded-full border border-border bg-input px-3 py-1 text-xs uppercase tracking-widest text-primary">
            Área do aluno
          </p>
          <h1 className="text-3xl font-semibold">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Bem vindo ao Labs! 
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm text-muted-foreground">
              Usuário
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60"
            />
          </div>
          {mode === "register" ? (
            <>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm text-muted-foreground">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="telefone" className="text-sm text-muted-foreground">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  autoComplete="tel"
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60"
                />
              </div>
            </>
          ) : null}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-muted-foreground">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl border border-primary/40 bg-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/30 disabled:opacity-60"
          >
            {busy ? "Enviando..." : mode === "login" ? "Entrar" : "Registrar"}
          </button>
        </form>

        {msg ? (
          <p className={`text-sm ${error ? "text-destructive" : "text-primary"}`}>{msg}</p>
        ) : null}

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setMsg(null);
          }}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "login" ? "Não tem conta? Registre-se" : "Já tem conta? Entrar"}
        </button>
      </div>
    </section>
  );
}
