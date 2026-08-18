import { createFileRoute } from "@tanstack/react-router";
import { CatalogGrid } from "@/components/CatalogGrid";
import { Section } from "@/components/Section";
import { games } from "@/data/catalog";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Games em JavaScript — Professor Anderson" },
      {
        name: "description",
        content:
          "Games feitos em HTML, CSS e JavaScript para estudo de lógica, física digital e animação, filtrados por assunto e dificuldade.",
      },
      { property: "og:title", content: "Games em JavaScript — Professor Anderson" },
      {
        property: "og:description",
        content: "Jogos de estudo por assunto e nível de dificuldade.",
      },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  return (
    <Section
      eyebrow="Jogos"
      title="Games para estudo"
      desc="Cada game é um laboratório: abra, jogue e leia o código. Filtre por assunto e dificuldade."
    >
      <CatalogGrid items={games} />
    </Section>
  );
}
