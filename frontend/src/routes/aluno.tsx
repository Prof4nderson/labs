/* Style reminder: preserve the imported holographic glass language and existing spacing; this page is an additive protected area, not a redesign. */
import { createFileRoute } from "@tanstack/react-router";
import { AccessGate } from "@/components/AccessGate";
import { Section } from "@/components/Section";
import { TaskList } from "@/components/TaskList";
import { UploadPanel } from "@/components/UploadPanel";

export const Route = createFileRoute("/aluno")({ component: StudentArea });

function StudentArea() {
  return (
    <AccessGate eyebrow="Área do aluno" title="Seu laboratório de estudo" description="Continue de onde parou e envie suas dúvidas junto do material certo.">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Section id="tarefas-aluno" eyebrow="Progresso" title="Lista de tarefas" desc="As marcações ficam salvas neste navegador.">
          <TaskList />
        </Section>
        <Section id="duvidas-aluno" eyebrow="Entregas" title="Enviar para o professor" desc="Anexe uma atividade ou material para receber orientação.">
          <UploadPanel />
        </Section>
      </div>
    </AccessGate>
  );
}
