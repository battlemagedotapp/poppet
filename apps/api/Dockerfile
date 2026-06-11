FROM node:22-bookworm-slim

ENV CI=1
ENV HUSKY=0
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/clients/app-client/package.json packages/clients/app-client/package.json
COPY packages/clients/auth-client/package.json packages/clients/auth-client/package.json
COPY packages/core/config/package.json packages/core/config/package.json
COPY packages/core/contracts/package.json packages/core/contracts/package.json
COPY packages/core/db-utils/package.json packages/core/db-utils/package.json
COPY packages/core/locale/package.json packages/core/locale/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @strawdev/api build

ENV NODE_ENV=production
WORKDIR /workspace/apps/api

EXPOSE 6201

CMD ["node", "dist/index.js"]
