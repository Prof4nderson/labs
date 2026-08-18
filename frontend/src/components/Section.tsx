import { LearningPath } from "@/components/LearningPath";
import { PollWidget } from "@/components/PollWidget";

export function Section({
  id,
  eyebrow,
  title,
  desc,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-5 py-16">
      <div className="mb-9 max-w-2xl space-y-3">
        <p className="inline-block rounded-full border border-border bg-input px-3 py-1 text-xs uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
        {desc ? <p className="text-muted-foreground">{desc}</p> : null}
      </div>
      {children}
    </section>
  );
}



export function HomePage() {
  return (
    <div>
      {/* Outras seções do site... */}

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
    </div>
  );
}