import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { CatalogGrid } from "@/components/CatalogGrid";
import { Section } from "@/components/Section";
import { TaskList } from "@/components/TaskList";
import { UploadPanel } from "@/components/UploadPanel";
import { PollWidget } from "@/components/PollWidget";
import { LearningPath } from "@/components/LearningPath";
import { infos, miniProjetos } from "@/data/catalog";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Professor Anderson — Tecnologia e DevOps" },
      {
        name: "description",
        content:
          "Mini projetos, laboratórios visuais, games e envio de arquivos das atividades de Tecnologia e DevOps.",
      },
      { property: "og:title", content: "Professor Anderson — Tecnologia e DevOps" },
      {
        property: "og:description",
        content:
          "Mini projetos, laboratórios visuais, games e envio de atividades para o professor.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-8 pt-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <p className="inline-block rounded-full border border-border bg-input px-3 py-1 text-xs uppercase tracking-widest text-primary">
            Tecnologia e DevOps
          </p>
          <h1 className="text-5xl font-semibold leading-[1.05] sm:text-6xl">
            <span className="text-prism">Professor Anderson</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Aulas, mini projetos e prática de verdade — laboratórios visuais,
            games em JavaScript e entrega de atividades em um só lugar.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/visuallabs"
              className="rounded-xl border border-primary/40 bg-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/30"
            >
              Explorar VisualLabs
            </Link>
            <Link
              to="/games"
              className="glass px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50"
            >
              Ver games
            </Link>
            <a
              href="#envio"
              className="glass px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50"
            >
              Enviar arquivo
            </a>
            <ThemeToggle />
          </div>
        </div>

        <div className="glass-strong crystal-edge relative grid aspect-square place-items-center overflow-hidden p-8">
          <div className="absolute size-64 rounded-full border border-primary/30" />
          <div className="absolute size-44 rounded-full border border-accent/30" />
          <div className="absolute size-24 rounded-full bg-primary/30 blur-2xl" />
          <div className="relative text-center">
            <p className="font-display text-6xl font-semibold text-prism">21</p>
            <p className="mt-2 text-sm text-muted-foreground">
              labs, games e projetos publicados
            </p>
          </div>
        </div>
      </section>

      <Section
        id="projetos"
        eyebrow="Prática"
        title="Mini projetos para estudos"
        desc="Projetos curtos por assunto e nível para fixar front-end, dados e automação."
      >
        <CatalogGrid items={miniProjetos} />
      </Section>

      <Section
        id="comunidade-trilha"
        eyebrow="Interação & Progresso"
        title="Sua Trilha de Estudos e Opinião"
        desc="Acompanhe sua evolução nos laboratórios e vote nos conteúdos que você quer ver por aqui."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <LearningPath />
          <PollWidget />
        </div>
      </Section>

      <Section
        id="informacoes"
        eyebrow="Turma"
        title="Informações gerais"
        desc="Horários, avaliação, materiais e contato do professor."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {infos.map((i) => (
            <div key={i.title} className="glass glass-hover space-y-3 p-6">
              <span className="rounded-full border border-border bg-input px-3 py-1 text-xs text-muted-foreground">
                {i.tag}
              </span>
              <h3 className="text-lg font-semibold">{i.title}</h3>
              <p className="text-sm text-muted-foreground">{i.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="tarefas"
        eyebrow="Organização"
        title="Lista de tarefas"
        desc="Marque o que já concluiu — suas tarefas ficam salvas neste navegador."
      >
        <TaskList />
      </Section>

      <Section
        id="envio"
        eyebrow="Entregas"
        title="Enviar arquivo para o Professor"
        desc="Arraste o arquivo ou clique para selecionar. O envio vai direto para o armazenamento seguro do professor."
      >
        <UploadPanel />
      </Section>
    </>
  );
}