import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MAX_MB = 20;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function slug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .toLowerCase();
}

export function UploadPanel() {
  const [nome, setNome] = useState("");
  const [atividade, setAtividade] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
    setError(false);
    setStatus(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError(true);
      setStatus("Informe seu nome antes de enviar.");
      return;
    }
    if (files.length === 0) {
      setError(true);
      setStatus("Selecione ao menos um arquivo.");
      return;
    }
    if (files.some((f) => f.size > MAX_BYTES)) {
      setError(true);
      setStatus(`Remova os arquivos acima de ${MAX_MB} MB.`);
      return;
    }

    setSending(true);
    setError(false);
    setStatus("Enviando...");

    try {
      for (const file of files) {
        const path = `${new Date().toISOString().slice(0, 10)}/${slug(nome)}/${Date.now()}-${slug(file.name)}`;
        const { error: upErr } = await supabase.storage
          .from("entregas")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;

        const { error: dbErr } = await supabase.from("submissions").insert({
          student_name: nome.trim(),
          activity: atividade.trim() || null,
          file_name: file.name,
          file_size: file.size,
          storage_path: path,
        });
        if (dbErr) throw dbErr;
      }
      setFiles([]);
      setStatus(
        `Enviado com sucesso! O professor já recebeu ${files.length} arquivo(s).`,
      );
    } catch (err) {
      setError(true);
      setStatus(`Falha no envio: ${(err as Error).message}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong space-y-5 p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
          placeholder="Atividade / mini projeto"
          value={atividade}
          onChange={(e) => setAtividade(e.target.value)}
        />
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-12 text-center transition-colors ${
          over ? "border-primary bg-primary/10" : "border-border bg-input"
        }`}
      >
        <strong className="text-base">Solte o arquivo aqui</strong>
        <small className="text-muted-foreground">
          ou clique para escolher — limite de {MAX_MB} MB por arquivo
        </small>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((f, i) => {
            const tooBig = f.size > MAX_BYTES;
            return (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-input px-4 py-2.5 text-sm"
              >
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-muted-foreground">{fmt(f.size)}</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs ${
                    tooBig
                      ? "border-destructive/50 bg-destructive/15 text-destructive"
                      : "border-aqua/40 bg-aqua/10 text-aqua"
                  }`}
                >
                  {tooBig ? "muito grande" : "ok"}
                </span>
                <button
                  type="button"
                  aria-label={`Remover ${f.name}`}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {status ? (
        <p
          className={`text-sm ${error ? "text-destructive" : "text-primary"}`}
          role="status"
        >
          {status}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="rounded-xl border border-primary/40 bg-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/30 disabled:opacity-60"
      >
        {sending ? "Enviando..." : "Enviar para o professor"}
      </button>
    </form>
  );
}
