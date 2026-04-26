# ─────────────────────────────────────────────
# Stage 1: Build the React/Vite app
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for layer caching
COPY package.json package-lock.json ./

RUN npm ci

# Copy source files
COPY . .

# Build args for Vite (injected at build time by CI)
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Serve via nginx (lean production image)
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check: hit the /health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -q --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
