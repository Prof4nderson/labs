/* Style reminder: preserve the existing holographic glass surfaces, prism cyan accents, rounded pills, and compact motion vocabulary. */
import { createFileRoute } from "@tanstack/react-router";
import { AccessGate } from "@/components/AccessGate";

export const Route = createFileRoute("/areas")({ component: AreasIndex });

function AreasIndex() {
  return (
    <AccessGate eyebrow="Áreas protegidas" title="Espaços de aprendizagem" description="Escolha o ambiente correspondente ao seu papel para continuar.">
      <div className="grid gap-6 md:grid-cols-2">
        <a href="/aluno" className="glass glass-hover crystal-edge group space-y-4 p-7">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Aluno</p>
          <h2 className="text-2xl font-semibold">Acompanhe sua trilha</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">Tarefas, materiais e dúvidas em um único espaço de estudo.</p>
          <span className="text-sm font-medium text-primary">Abrir área →</span>
        </a>
        <a href="/professor" className="glass glass-hover crystal-edge group space-y-4 p-7">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Professor</p>
          <h2 className="text-2xl font-semibold">Organize a turma</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">Acesse entregas, materiais e o espaço de respostas da turma.</p>
          <span className="text-sm font-medium text-primary">Abrir área →</span>
        </a>
      </div>
    </AccessGate>
  );
}
