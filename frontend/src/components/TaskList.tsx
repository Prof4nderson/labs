import { useEffect, useState } from "react";

interface Task {
  text: string;
  done: boolean;
}

const KEY = "prof-anderson-tasks";
const INITIAL: Task[] = [
  { text: "Terminar o projeto Lista de Dados", done: false },
  { text: "Fazer os exercícios da aula Formatos de Dados", done: false },
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTasks(JSON.parse(raw) as Task[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(tasks));
    } catch {
      /* ignore */
    }
  }, [tasks, ready]);

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? (done / tasks.length) * 100 : 0;

  return (
    <div className="glass-strong space-y-5 p-7">
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          const v = value.trim();
          if (!v) return;
          setTasks([...tasks, { text: v, done: false }]);
          setValue("");
        }}
      >
        <input
          className="flex-1 rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
          placeholder="Nova tarefa (ex.: revisar comandos do Git)"
          maxLength={120}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-xl border border-primary/40 bg-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/30"
        >
          Adicionar
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li
            key={`${t.text}-${i}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-input px-4 py-3 text-sm"
          >
            <input
              type="checkbox"
              checked={t.done}
              className="size-4 accent-[var(--primary)]"
              onChange={() =>
                setTasks(
                  tasks.map((x, idx) =>
                    idx === i ? { ...x, done: !x.done } : x,
                  ),
                )
              }
            />
            <span
              className={`flex-1 ${t.done ? "text-muted-foreground line-through" : ""}`}
            >
              {t.text}
            </span>
            <button
              type="button"
              aria-label={`Remover ${t.text}`}
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground">
        {tasks.length
          ? `${done} de ${tasks.length} tarefas concluídas`
          : "Nenhuma tarefa por aqui — adicione a primeira."}
      </p>
      <div className="h-2 overflow-hidden rounded-full border border-border bg-input">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
