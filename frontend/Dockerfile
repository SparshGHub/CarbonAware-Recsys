# Build stage - optimized for stability and memory efficiency
FROM node:20-slim AS builder

WORKDIR /app

# Set Node.js memory limit to prevent OOM during build
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Copy package files only first (better layer caching)
COPY package*.json ./

# Install dependencies - use npm ci if lockfile exists, otherwise npm install
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy application code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage - lightweight runtime
FROM node:20-slim AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Copy only necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

CMD ["npm", "start"]
