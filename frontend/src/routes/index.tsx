/* Style reminder: preserve the existing holographic glass layout, prism gradients, dark navy background, cyan/violet accents, and generous editorial spacing. */
import { createFileRoute, Link } from "@tanstack/react-router";
import portal from "@/data/portal.json";
import { CommentsPanel } from "@/components/CommentsPanel";
import { Section } from "@/components/Section";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal — Professor Anderson" },
      { name: "description", content: portal.site.description },
      { property: "og:title", content: portal.site.title },
      { property: "og:description", content: portal.site.description },
    ],
  }),
  component: PortalHome,
});

function PortalHome() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-end gap-10 px-5 pb-16 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
        <div className="space-y-6">
          <p className="inline-block rounded-full border border-border bg-input px-3 py-1 text-xs uppercase tracking-[0.22em] text-primary">
            {portal.site.eyebrow}
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-tight sm:text-7xl">
            <span className="text-prism">{portal.site.title}</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{portal.site.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/visuallabs" className="rounded-xl border border-primary/40 bg-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/30">Explorar laboratórios</Link>
            <Link to="/downloads" className="glass px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50">Abrir downloads</Link>
            <ThemeToggle />
          </div>
        </div>
        <article className="glass-strong crystal-edge group overflow-hidden">
          {portal.featured.image ? <img src={portal.featured.image} alt="" className="h-48 w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-105" /> : null}
          <div className="space-y-4 p-7">
            <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-primary"><span>{portal.site.featuredLabel}</span><span>{portal.featured.category}</span></div>
            <h2 className="text-2xl font-semibold leading-tight">{portal.featured.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{portal.featured.summary}</p>
            <a href={portal.featured.href} className="inline-block text-sm font-medium text-primary">Ler destaque →</a>
          </div>
        </article>
      </section>

      <Section id="artigos" eyebrow="Leitura guiada" title="Artigos recentes" desc="Conteúdo editorial para acompanhar os laboratórios e transformar prática em repertório.">
        <div className="grid gap-6 md:grid-cols-3">
          {portal.articles.map((article) => <ArticleCard key={article.title} article={article} />)}
        </div>
      </Section>

      <Section id="noticias" eyebrow="Atualizações" title="Notícias do portal" desc="Avisos, materiais novos e movimentos importantes da turma.">
        <div className="grid gap-4 lg:grid-cols-3">
          {portal.news.map((item) => (
            <a key={item.title} href={item.href} className="glass glass-hover space-y-4 p-6">
              <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-primary"><span>{item.category}</span><span className="text-muted-foreground">{item.date}</span></div>
              <h3 className="text-xl font-semibold leading-tight">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              <span className="text-sm font-medium text-primary">Abrir atualização →</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="atalhos" eyebrow="Acesso rápido" title="Continue explorando" desc="As áreas comuns permanecem abertas. O login só é solicitado ao entrar nos espaços de aluno ou professor.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["VisualLabs", "Laboratórios interativos por assunto", "/visuallabs"],
            ["Games", "Projetos para estudar lógica e animação", "/games"],
            ["Downloads", "Arquivos estáticos do repositório", "/downloads"],
            ["Dúvidas", "Pergunte e acompanhe respostas", "/#comentarios"],
          ].map(([title, description, href]) => <a key={title} href={href} className="glass glass-hover space-y-3 p-6"><p className="text-lg font-semibold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{description}</p><span className="text-sm font-medium text-primary">Acessar →</span></a>)}
        </div>
      </Section>

      <Section id="comentarios" eyebrow="Dúvidas & respostas" title="Converse sobre o material" desc="Envie uma pergunta e acompanhe a resposta junto do contexto do laboratório.">
        <CommentsPanel />
      </Section>
    </>
  );
}

function ArticleCard({ article }: { article: (typeof portal.articles)[number] }) {
  return <a href={article.href} className="glass glass-hover crystal-edge group flex flex-col overflow-hidden"><img src={article.image} alt="" className="h-40 w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-105" /><div className="flex flex-1 flex-col gap-4 p-6"><div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-primary"><span>{article.category}</span><span className="text-muted-foreground">{article.readTime}</span></div><h3 className="text-xl font-semibold leading-tight">{article.title}</h3><p className="flex-1 text-sm leading-relaxed text-muted-foreground">{article.summary}</p><div className="flex items-center justify-between text-xs text-muted-foreground"><span>{article.date}</span><span className="font-medium text-primary">Ler artigo →</span></div></div></a>;
}
