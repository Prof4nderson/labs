# Reconstrução do Labs V2 — correções de CORS e segurança

Stack preservada: Spring Boot 3.2 + Java 17 + PostgreSQL/pgvector + LangChain4j no backend, TanStack Start (React 19) no frontend, tudo em Docker Compose. Nenhum contrato de API, rota ou estilo visual foi alterado.

## Causa do bloqueio de CORS

O erro `No 'Access-Control-Allow-Origin' header is present` no `POST /api/auth/login` tinha três causas somadas:

1. **`@CrossOrigin(origins = "http://localhost:8082")` no `AuthController`.** Anotação no controller tem precedência sobre a configuração global do Spring Security. Qualquer origem diferente de `localhost:8082` — inclusive `http://2.25.108.222:3000` — recebia preflight rejeitado sem o cabeçalho. **Removida.**
2. **Nome de variável divergente.** O `SecurityConfig` lia `CORS_ALLOWED_ORIGINS`, mas o Compose injetava `FRONTEND_ORIGINS`. O backend ficava sempre no default `localhost`. Agora lê `FRONTEND_ORIGINS` (com `CORS_ALLOWED_ORIGINS` aceito como alternativa).
3. **IP incorreto no default do Compose:** `2.25.102.222` em vez de `2.25.108.222`. Os valores agora vêm do `.env` (veja `.env.example`).

Além disso o preflight `OPTIONS` foi liberado explicitamente na cadeia de segurança e o filtro JWT deixa de processá-lo.

## Correções de segurança (mínimas e necessárias)

- **Token JWT sem `subject` e sem assinatura.** `generateToken` não definia o usuário nem chamava `signWith` — o token era inválido/forjável e o login nunca autenticava de fato. Corrigido com `subject` + `signWith(HS256)`.
- **Segredo JWT fraco no repositório.** O `application.yaml` trazia uma chave fixa. Agora vem só de `JWT_SECRET` e a aplicação falha ao subir se a chave tiver menos de 32 caracteres.
- **Endpoints de IA e de indexação abertos.** `/api/ai/**` e `/api/vector/**` eram `permitAll` — qualquer pessoa gastava sua cota da OpenAI e gravava no banco vetorial. Agora exigem JWT (o frontend já envia o token e já protege essas telas).
- **Credenciais do banco fixas no código.** `VectorStoreConfig` tinha host/usuário/senha hardcoded; passa a derivar do `spring.datasource.*` (variáveis de ambiente). O `application.yaml` também não guarda mais senha.
- **Token inválido virava HTTP 500.** O filtro JWT agora trata a exceção e deixa o Spring responder 401.
- **Swagger fechado por padrão** (`LABS_DOCS_PUBLIC=true` reabre, se necessário).
- **Vazamento em erros:** `include-message`/`include-stacktrace` desativados; `open-in-view: false`.
- **Postgres não é mais publicado no host** — fica só na rede interna do Compose.
- **Containers sem root:** backend e frontend rodam com usuário sem privilégios.
- Removidos do repositório: `backend/target/` (build versionada), o arquivo inválido `controller/AuthController` sem extensão e o `.github/docker-compose.yml` duplicado/desatualizado.

## Implantação na VPS

1. Crie o `.env` na raiz a partir de `.env.example`:

```env
DB_NAME=ai_db
DB_USER=labs
DB_PASSWORD=<senha forte>
JWT_SECRET=<openssl rand -base64 48>
OPENAI_API_KEY=sk-...
FRONTEND_ORIGINS=http://2.25.108.222:3000
VITE_LABS_API_URL=http://2.25.108.222:8081
```

`FRONTEND_ORIGINS` deve ser a origem **exata** que aparece na barra do navegador (protocolo + host + porta). Com domínio e HTTPS, use `https://seu-dominio.com`.

2. Suba:

```bash
docker compose down
docker compose build --no-cache backend frontend
docker compose up -d
docker compose ps
```

3. Valide o preflight:

```bash
curl -i -X OPTIONS http://2.25.108.222:8081/api/auth/login \
  -H "Origin: http://2.25.108.222:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"
```

Deve retornar `200/204` com `Access-Control-Allow-Origin: http://2.25.108.222:3000`.

> `VITE_LABS_API_URL` é embutida no bundle durante o build do frontend: ao trocar esse valor, refaça `docker compose build frontend`.

## Validação executada

- Backend: `mvn clean package -DskipTests` → **BUILD SUCCESS** (Java 17, mesmas dependências).
- Frontend: `npm install` + `NITRO_PRESET=node-server npm run build` → build concluída, `.output/server/index.mjs` gerado.
