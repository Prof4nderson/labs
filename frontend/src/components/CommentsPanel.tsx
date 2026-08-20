/* Style reminder: keep the existing glass panels, compact pills, muted body text, and prism-cyan action states. */
import { useEffect, useState } from "react";

type Comment = { id: number; author: string; text: string; answer?: string };
const STORAGE_KEY = "visual-labs-comments";

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Professor Anderson",
    text: "Use este espaço para enviar uma dúvida sobre qualquer laboratório.",
    answer: "A dúvida fica vinculada ao material e pode receber uma resposta aqui.",
  },
];

export function CommentsPanel() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [replying, setReplying] = useState<number | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setComments(JSON.parse(saved) as Comment[]);
  }, []);

  function persist(next: Comment[]) {
    setComments(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function submitQuestion(event: React.FormEvent) {
    event.preventDefault();
    if (!author.trim() || !text.trim()) return;
    persist([{ id: Date.now(), author: author.trim(), text: text.trim() }, ...comments]);
    setAuthor("");
    setText("");
  }

  function submitReply(event: React.FormEvent, id: number) {
    event.preventDefault();
    if (!reply.trim()) return;
    persist(comments.map((comment) => (comment.id === id ? { ...comment, answer: reply.trim() } : comment)));
    setReply("");
    setReplying(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={submitQuestion} className="glass space-y-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Nova dúvida</p>
          <h3 className="mt-2 text-2xl font-semibold">Converse sobre o laboratório</h3>
        </div>
        <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Seu nome" className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60" />
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Escreva sua dúvida..." rows={5} className="w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60" />
        <button type="submit" className="w-full rounded-xl border border-primary/40 bg-primary/20 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/30">Publicar dúvida</button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <article key={comment.id} className="glass space-y-4 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{comment.author}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{comment.text}</p>
              </div>
              <span className="rounded-full border border-border bg-input px-3 py-1 text-[11px] text-muted-foreground">Dúvida</span>
            </div>
            {comment.answer ? (
              <div className="rounded-xl border border-primary/25 bg-primary/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">Resposta</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{comment.answer}</p>
              </div>
            ) : (
              <div>
                {replying === comment.id ? (
                  <form onSubmit={(event) => submitReply(event, comment.id)} className="space-y-3">
                    <textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Escreva uma resposta..." rows={3} className="w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60" />
                    <div className="flex gap-2">
                      <button type="submit" className="rounded-xl border border-primary/40 bg-primary/20 px-4 py-2 text-xs font-semibold text-primary">Responder</button>
                      <button type="button" onClick={() => setReplying(null)} className="rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <button type="button" onClick={() => setReplying(comment.id)} className="text-sm font-medium text-primary hover:underline">Responder dúvida →</button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
