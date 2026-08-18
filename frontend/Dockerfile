FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# URL publica da API (embutida no bundle do navegador). Vazio = fallback para o hostname atual:8081.
ARG VITE_LABS_API_URL=""
ENV VITE_LABS_API_URL=$VITE_LABS_API_URL
ENV NITRO_PRESET=node-server
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# O preset node-server ja empacota as dependencias dentro de .output.
COPY --from=build /app/.output ./.output

# Container roda sem privilegios de root.
USER node

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
