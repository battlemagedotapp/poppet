FROM node:22-alpine AS base
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @strawdev/app-service build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/services/app-service/dist ./dist
COPY --from=builder /app/apps/services/app-service/package.json ./package.json
COPY --from=builder /app/apps/services/app-service/migrations ./migrations
ENV NODE_ENV=production
RUN pnpm install --prod
EXPOSE 8080
CMD ["node", "dist/index.js"]
