import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CatalogGrid } from "@/components/CatalogGrid";
import { Section } from "@/components/Section";
import { visualLabs } from "@/data/catalog";
import { clearSession, getToken, getUsername } from "@/lib/labs-api";

export const Route = createFileRoute("/visuallabs")({
  head: () => ({
    meta: [
      { title: "VisualLabs — Laboratórios Interativos | Professor Anderson" },
      {
        name: "description",
        content:
          "Laboratórios visuais de front-end, programação, dados, DevOps, segurança e IA, organizados por assunto e dificuldade.",
      },
      { property: "og:title", content: "VisualLabs — Laboratórios Interativos" },
      {
        property: "og:description",
        content:
          "Labs interativos de HTML, CSS, JS, SQL, Docker, redes, segurança e IA.",
      },
    ],
  }),
  component: LabsPage,
});

function LabsPage() {
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
    <Section
      eyebrow="VisualLabs"
      title="Laboratórios interativos"
      desc="Conteúdo visual e prático para cada tema do curso. Filtre por assunto e dificuldade."
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-input/40 px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Conectado como <strong className="text-foreground">{user}</strong>
        </p>
        <button
          type="button"
          onClick={() => {
            clearSession();
            navigate({ to: "/login" });
          }}
          className="glass px-4 py-2 text-xs font-semibold transition-colors hover:border-primary/50"
        >
          Sair
        </button>
      </div>

      <CatalogGrid items={visualLabs} />
    </Section>
  );
}