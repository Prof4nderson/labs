// Extração de texto no navegador para ingestão RAG.
// A API recebe apenas texto puro, então convertemos cada formato aqui.

export const ACCEPTED_EXTENSIONS = [
  "pdf",
  "xls",
  "xlsx",
  "xlsm",
  "csv",
  "tsv",
  "docx",
  "txt",
  "md",
  "markdown",
  "json",
  "log",
  "html",
  "htm",
  "xml",
  "yaml",
  "yml",
] as const;

export const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.map((e) => `.${e}`).join(",");

export function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i < 0 ? "" : name.slice(i + 1).toLowerCase();
}

export function isSupported(name: string): boolean {
  return (ACCEPTED_EXTENSIONS as readonly string[]).includes(extOf(name));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function extractPdf(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((it) => ("str" in it ? (it as { str: string }).str : ""))
      .join(" ");
    parts.push(`[Página ${p}]\n${text}`);
    onProgress?.(Math.round((p / doc.numPages) * 100));
  }
  return parts.join("\n\n");
}

async function extractSheet(file: File): Promise<string> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  return wb.SheetNames.map((name) => {
    const sheet = wb.Sheets[name];
    if (!sheet) return "";
    return `# Planilha: ${name}\n${XLSX.utils.sheet_to_csv(sheet)}`;
  })
    .filter(Boolean)
    .join("\n\n");
}

async function extractDocx(file: File): Promise<string> {
  // @ts-expect-error - build de navegador sem tipos
  const mammoth = (await import("mammoth/mammoth.browser.min.js")).default ?? (await import("mammoth/mammoth.browser.min.js"));
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value as string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function extractText(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const ext = extOf(file.name);
  onProgress?.(5);
  switch (ext) {
    case "pdf":
      return extractPdf(file, onProgress);
    case "xls":
    case "xlsx":
    case "xlsm":
      return extractSheet(file);
    case "docx":
      return extractDocx(file);
    case "html":
    case "htm":
      return stripHtml(await file.text());
    default:
      return file.text();
  }
}
