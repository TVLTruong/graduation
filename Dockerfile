# Image for the NestJS API (apps/api) in this pnpm monorepo.
# Build from the repo root:  docker build -t graduation-api .
FROM node:22-slim

# Prisma needs OpenSSL at runtime
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    PORT=3001 \
    CI=true

RUN corepack enable

WORKDIR /app

# Install dependencies first so this layer is cached until a manifest changes.
# NODE_ENV=production would skip devDependencies (the Nest CLI, TypeScript, Prisma CLI)
# that the build step below still needs, so install with it unset.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN NODE_ENV=development pnpm install --frozen-lockfile --filter api...

# Build the API (generate the Prisma client, then compile)
COPY apps/api apps/api
RUN pnpm --filter api exec prisma generate \
 && pnpm --filter api build

USER node
EXPOSE 3001

# The build output lands in dist/src (prisma.config.ts is compiled next to src)
CMD ["node", "apps/api/dist/src/main"]
