/* Style reminder: preserve the imported holographic glass language, prism accents, and existing layout density; this is a protected additive page. */
import { createFileRoute } from "@tanstack/react-router";
import { AccessGate } from "@/components/AccessGate";

export const Route = createFileRoute("/professor")({ component: TeacherArea });

function TeacherArea() {
  return (
    <AccessGate eyebrow="Área do professor" title="Painel da turma" description="Acesse os pontos de acompanhamento sem alterar o fluxo de publicação dos labs.">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ["Materiais", "VisualLabs e mini projetos publicados", "/visuallabs"],
          ["Entregas", "Arquivos enviados pelos alunos", "/aluno#duvidas-aluno"],
          ["Respostas", "Dúvidas e comentários da turma", "/#comentarios"],
        ].map(([label, value, link]) => (
          <a key={label} href={link} className="glass glass-hover space-y-3 p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-primary">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
            <span className="text-sm text-muted-foreground">Abrir módulo →</span>
          </a>
        ))}
      </div>
      <div className="mt-8 glass space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Atalho de publicação</p>
        <h2 className="text-2xl font-semibold">Biblioteca pronta para a próxima aula</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">Use os materiais existentes e os novos cards de projetos para orientar a turma sem alterar a estrutura do backend.</p>
      </div>
    </AccessGate>
  );
}
