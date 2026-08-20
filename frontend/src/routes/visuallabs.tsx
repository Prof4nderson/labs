import { createFileRoute } from "@tanstack/react-router";
/* Style reminder: preserve the existing holographic glass layout, prism accents, and catalog spacing; this is a public common area. */
import { CatalogGrid } from "@/components/CatalogGrid";
import { Section } from "@/components/Section";
import { visualLabs } from "@/data/catalog";

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
  return (
    <Section
      eyebrow="VisualLabs"
      title="Laboratórios interativos"
      desc="Conteúdo visual e prático para cada tema do curso. Filtre por assunto e dificuldade."
    >
      <CatalogGrid items={visualLabs} />
    </Section>
  );
}