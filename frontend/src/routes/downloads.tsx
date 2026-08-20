/* Style reminder: use the same glass cards, prism cyan accents, typography hierarchy, and dark holographic backdrop as the existing site. */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/downloads")({
  head: () => ({ meta: [{ title: "Downloads — Visual Labs" }] }),
  component: DownloadsPage,
});

const files = [
  ["Lista de Itens JavaScript", "/labs/projetos/lista-anderson/index.html", "Projeto front-end"],
  ["Formatos de Dados", "/labs/projetos/aula1208/aula_formatos.html", "Guia de dados"],
  ["Exercícios de Formatos", "/labs/projetos/aula1208/exercicios.html", "Prática"],
  ["Igloo Game — estudo", "/labs/projetos/igloo/igloo_v2.html", "HTML, CSS e JavaScript"],
  ["Psychodelic Dragon", "/labs/projetos/PsyDragon/index.html", "Canvas e animação"],
];

function DownloadsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:py-20">
      <div className="mb-10 max-w-2xl space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">Repositório</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Downloads</h1>
        <p className="text-base leading-relaxed text-muted-foreground">Acesse os projetos publicados no container. Cada item abre o arquivo correspondente sem alterar o backend.</p>
      </div>
      <div className="glass mb-8 flex flex-col gap-2 p-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Origem: <code className="text-primary">public/labs/projetos</code></span>
        <span>Arquivos estáticos disponíveis para estudo</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {files.map(([title, href, category]) => (
          <a key={href} href={href} className="glass glass-hover crystal-edge group space-y-4 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{category}</p>
            <h2 className="text-xl font-semibold">{title}</h2>
            <span className="text-sm font-medium text-primary">Abrir arquivo →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
