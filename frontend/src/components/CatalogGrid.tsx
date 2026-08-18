import { useMemo, useState } from "react";
import type { CatalogItem } from "@/data/catalog";

const DIFICULDADES = ["Iniciante", "Intermediário", "Avançado"] as const;

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active
          ? "border-primary/60 bg-primary/20 text-primary"
          : "border-border bg-input text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function DifficultyBadge({ level }: { level: CatalogItem["dificuldade"] }) {
  const tone =
    level === "Iniciante"
      ? "text-aqua border-aqua/40 bg-aqua/10"
      : level === "Intermediário"
        ? "text-amber-glow border-amber-glow/40 bg-amber-glow/10"
        : "text-violet-glow border-violet-glow/40 bg-violet-glow/10";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>
      {level}
    </span>
  );
}

export function CatalogCard({ item }: { item: CatalogItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="glass glass-hover crystal-edge group flex flex-col overflow-hidden"
    >
      {item.image ? (
        <div className="h-40 overflow-hidden border-b border-border">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-input px-3 py-1 text-xs text-muted-foreground">
            {item.assunto}
          </span>
          <DifficultyBadge level={item.dificuldade} />
        </div>
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <span className="text-sm font-medium text-primary">
          Acessar <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}

export function CatalogGrid({ items }: { items: CatalogItem[] }) {
  const assuntos = useMemo(
    () => Array.from(new Set(items.map((i) => i.assunto))).sort(),
    [items],
  );
  const [assunto, setAssunto] = useState<string | null>(null);
  const [nivel, setNivel] = useState<string | null>(null);

  const filtered = items.filter(
    (i) =>
      (!assunto || i.assunto === assunto) && (!nivel || i.dificuldade === nivel),
  );

  return (
    <div className="space-y-8">
      <div className="glass flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs uppercase tracking-widest text-muted-foreground">
            Assunto
          </span>
          <Chip active={!assunto} onClick={() => setAssunto(null)}>
            Todos
          </Chip>
          {assuntos.map((a) => (
            <Chip key={a} active={assunto === a} onClick={() => setAssunto(a)}>
              {a}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs uppercase tracking-widest text-muted-foreground">
            Dificuldade
          </span>
          <Chip active={!nivel} onClick={() => setNivel(null)}>
            Todas
          </Chip>
          {DIFICULDADES.map((d) => (
            <Chip key={d} active={nivel === d} onClick={() => setNivel(d)}>
              {d}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <CatalogCard key={item.title} item={item} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Nenhum item com esses filtros.
        </p>
      ) : null}
    </div>
  );
}
