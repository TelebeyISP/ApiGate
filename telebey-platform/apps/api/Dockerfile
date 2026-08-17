# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Build tools for native modules (bcrypt requires python3/make/g++)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy manifests first — Docker layer cache skips npm install if unchanged
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript → dist/
COPY . .
RUN npm run build

# Strip dev dependencies before copying to production stage
RUN npm prune --omit=dev

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# dumb-init: proper signal forwarding and zombie process reaping
RUN apk add --no-cache dumb-init

# Non-root user for reduced attack surface
RUN addgroup -S telebey && adduser -S telebey -G telebey
WORKDIR /app

# Copy only what's needed for production
COPY --from=builder --chown=telebey:telebey /app/dist         ./dist
COPY --from=builder --chown=telebey:telebey /app/node_modules ./node_modules
COPY --from=builder --chown=telebey:telebey /app/package.json ./package.json

USER telebey

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
