import { useCallback, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  FileType2,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { indexDocument } from "@/lib/labs-api";
import { ACCEPT_ATTR, extOf, extractText, formatBytes, isSupported } from "@/lib/file-extract";

type SourceStatus = "pending" | "extracting" | "indexing" | "done" | "error";

type Source = {
  id: string;
  name: string;
  size: number;
  kind: string;
  file?: File;
  text?: string;
  status: SourceStatus;
  progress: number;
  message?: string;
  chunks?: number;
};

const CHUNK_SIZE = 4000;

function chunkText(text: string): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];
  if (clean.length <= CHUNK_SIZE) return [clean];

  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    let end = Math.min(start + CHUNK_SIZE, clean.length);
    if (end < clean.length) {
      const breakPoint = clean.lastIndexOf("\n", end);
      if (breakPoint > start + CHUNK_SIZE * 0.5) end = breakPoint;
    }
    chunks.push(clean.slice(start, end).trim());
    start = end;
  }
  return chunks.filter(Boolean);
}

function iconFor(kind: string) {
  if (["xls", "xlsx", "xlsm", "csv", "tsv"].includes(kind)) return FileSpreadsheet;
  if (kind === "pdf" || kind === "docx") return FileType2;
  return FileText;
}

function safeDownloadName(name: string) {
  const base = name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
  return `${base || "fonte-rag"}.txt`;
}

function downloadText(name: string, text: string) {
  const blob = new Blob(["\ufeff", text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeDownloadName(name);
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const statusLabel: Record<SourceStatus, string> = {
  pending: "Na fila",
  extracting: "Extraindo texto",
  indexing: "Indexando",
  done: "Indexado",
  error: "Falhou",
};

export function RagIngest() {
  const [sources, setSources] = useState<Source[]>([]);
  const [pasted, setPasted] = useState("");
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const update = useCallback((id: string, patch: Partial<Source>) => {
    setSources((prev) =>
      prev.map((source) => (source.id === id ? { ...source, ...patch } : source)),
    );
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setSources((prev) => [
      ...prev,
      ...list.map<Source>((file, index) => {
        const supported = isSupported(file.name);
        return {
          id: `${file.name}-${file.size}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: file.size,
          kind: extOf(file.name),
          file,
          status: supported ? "pending" : "error",
          progress: 0,
          message: supported ? undefined : "Formato não suportado.",
        };
      }),
    ]);
  }, []);

  function addPasted() {
    const text = pasted.trim();
    if (!text) return;
    setSources((prev) => [
      ...prev,
      {
        id: `texto-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: `Texto colado (${new Date().toLocaleTimeString("pt-BR")})`,
        size: new Blob([text]).size,
        kind: "txt",
        text,
        status: "pending",
        progress: 0,
      },
    ]);
    setPasted("");
  }

  const stats = useMemo(
    () => ({
      total: sources.length,
      done: sources.filter((source) => source.status === "done").length,
      failed: sources.filter((source) => source.status === "error").length,
      pending: sources.filter((source) => source.status === "pending").length,
    }),
    [sources],
  );

  async function processOne(source: Source) {
    try {
      let text = source.text ?? "";
      if (!text && source.file) {
        update(source.id, { status: "extracting", progress: 5, message: undefined });
        text = await extractText(source.file, (pct) =>
          update(source.id, { progress: Math.round(pct * 0.4) }),
        );
        update(source.id, { text });
      }

      const chunks = chunkText(text);
      if (!chunks.length) throw new Error("Nenhum texto legível encontrado no arquivo.");

      update(source.id, { status: "indexing", progress: 45, chunks: chunks.length, text });
      for (let index = 0; index < chunks.length; index += 1) {
        const chunk = chunks[index];
        if (!chunk) continue;
        await indexDocument(
          `[Fonte: ${source.name} — parte ${index + 1}/${chunks.length}]\n${chunk}`,
        );
        update(source.id, {
          progress: 45 + Math.round(((index + 1) / chunks.length) * 55),
          message: `Parte ${index + 1} de ${chunks.length} enviada`,
        });
      }

      update(source.id, {
        status: "done",
        progress: 100,
        message: `${chunks.length} trecho(s) indexado(s) na base vetorial`,
      });
    } catch (error) {
      update(source.id, {
        status: "error",
        progress: 100,
        message: error instanceof Error ? error.message : "Erro ao indexar a fonte.",
      });
    }
  }

  async function runQueue() {
    if (running) return;
    setRunning(true);
    try {
      const queue = sources.filter(
        (source) => source.status === "pending" || source.status === "error",
      );
      for (const source of queue) await processOne(source);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="glass space-y-6 px-6 py-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Ingestão para o RAG</h2>
        <p className="text-sm text-muted-foreground">
          Envie PDFs, planilhas, DOCX, TXT, MD, JSON, HTML ou cole um texto. O conteúdo é extraído
          no navegador, dividido em trechos e enviado à base vetorial.
        </p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? "border-primary bg-primary/10"
            : "border-border bg-input/40 hover:border-primary/50"
        }`}
      >
        <UploadCloud className="h-8 w-8 text-primary" aria-hidden />
        <p className="text-sm font-medium">Arraste arquivos aqui ou clique para selecionar</p>
        <p className="text-xs text-muted-foreground">
          PDF · XLS · XLSX · CSV · DOCX · TXT · MD · JSON · HTML
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files ?? []);
            event.target.value = "";
          }}
        />
      </div>

      <div className="space-y-3">
        <textarea
          value={pasted}
          onChange={(event) => setPasted(event.target.value)}
          rows={4}
          placeholder="Ou cole aqui um conteúdo de aula para adicionar à coleção..."
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary/60"
        />
        <button
          type="button"
          onClick={addPasted}
          disabled={!pasted.trim()}
          className="rounded-xl border border-border px-4 py-2 text-sm transition-colors hover:border-primary/50 disabled:opacity-50"
        >
          Adicionar texto à coleção
        </button>
      </div>

      {sources.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {stats.total} fonte(s) · {stats.done} indexada(s) · {stats.pending} na fila
              {stats.failed ? ` · ${stats.failed} com erro` : ""}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setSources((prev) => prev.filter((source) => source.status !== "done"))
                }
                disabled={running || stats.done === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm transition-colors hover:border-primary/50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden /> Limpar concluídas
              </button>
              <button
                type="button"
                onClick={runQueue}
                disabled={running || stats.pending + stats.failed === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/20 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/30 disabled:opacity-60"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                {running ? "Indexando..." : "Processar fila"}
              </button>
            </div>
          </div>

          <ul className="space-y-2">
            {sources.map((source) => {
              const Icon = iconFor(source.kind);
              return (
                <li
                  key={source.id}
                  className="rounded-xl border border-border bg-input/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{source.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(source.size)} · {statusLabel[source.status]}
                        {source.message ? ` · ${source.message}` : ""}
                      </p>
                    </div>
                    {source.status === "done" && source.text ? (
                      <button
                        type="button"
                        aria-label={`Baixar texto extraído de ${source.name}`}
                        title="Baixar texto extraído"
                        onClick={() => downloadText(source.name, source.text ?? "")}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <Download className="h-4 w-4" aria-hidden />
                      </button>
                    ) : null}
                    {source.status === "done" ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
                    ) : source.status === "error" ? (
                      <AlertCircle className="h-5 w-5 text-destructive" aria-hidden />
                    ) : source.status === "pending" ? (
                      <button
                        type="button"
                        aria-label={`Remover ${source.name}`}
                        onClick={() =>
                          setSources((prev) => prev.filter((item) => item.id !== source.id))
                        }
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="h-4 w-4" aria-hidden />
                      </button>
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
                    )}
                  </div>

                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      role="progressbar"
                      aria-valuenow={source.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className={`h-full rounded-full transition-all duration-300 ${
                        source.status === "error" ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${source.status === "error" ? 100 : source.progress}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
