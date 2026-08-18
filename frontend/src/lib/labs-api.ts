// Cliente do backend Spring Boot (labs-backend). Os endpoints não são alterados.
// A URL pode ser definida por VITE_LABS_API_URL. Na VPS, o fallback usa o hostname público do frontend.
const configuredApiUrl = (import.meta.env["VITE_LABS_API_URL"] as string | undefined)?.replace(/\/$/, "");

export const LABS_API_URL =
  configuredApiUrl ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8081`
    : "http://localhost:8081");

const TOKEN_KEY = "labs.jwt";
const USER_KEY = "labs.user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
}

export function setSession(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
  window.dispatchEvent(new Event("labs-auth-changed"));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("labs-auth-changed"));
}

async function request(path: string, init: RequestInit): Promise<string> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${LABS_API_URL}${path}`, { ...init, headers });
  } catch {
    throw new Error(
      `Não foi possível conectar à API em ${LABS_API_URL}. Verifique se o backend está no ar.`,
    );
  }

  const body = await res.text();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error(body || "Credenciais inválidas ou sessão expirada.");
    }
    throw new Error(body || `Erro ${res.status} na API.`);
  }
  return body;
}

/** POST /api/auth/login -> { token } */
export async function login(username: string, password: string): Promise<string> {
  const body = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const token = (JSON.parse(body) as { token: string }).token;
  setSession(token, username);
  return token;
}

/** POST /api/auth/register */
export async function register(
  username: string,
  password: string,
  email: string,
  telefone: string,
): Promise<string> {
  return request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, telefone }),
  });
}

/** POST /api/ai/chat -> texto puro */
export async function chat(prompt: string): Promise<string> {
  return request("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
}

/** POST /api/vector/index -> texto puro (ingestão para o RAG) */
export async function indexDocument(text: string): Promise<string> {
  return request("/api/vector/index", {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: text,
  });
}
