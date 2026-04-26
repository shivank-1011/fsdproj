# ─────────────────────────────────────────────
# Stage 1: Dependencies + Prisma client build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install system deps needed by Prisma (openssl) and bcrypt (python/make/g++)
RUN apk add --no-cache openssl python3 make g++

# Copy package files first for layer caching
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install ALL deps (including devDeps for prisma CLI)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# ─────────────────────────────────────────────
# Stage 2: Production image (lean)
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install only runtime system deps
RUN apk add --no-cache openssl curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy application source
COPY src ./src
COPY app.js ./
COPY index.js ./

# Set ownership
RUN chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 5001

# Health check: ping the root endpoint every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5001/ || exit 1

CMD ["node", "index.js"]
