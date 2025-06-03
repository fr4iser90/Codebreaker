# Build stage
FROM node:20-alpine AS builder

# Set up non-root user first
RUN adduser --disabled-password --gecos '' appuser

# Create and set permissions for app directory
RUN mkdir -p /app && chown appuser:appuser /app

USER appuser
WORKDIR /app

# Install dependencies
COPY --chown=appuser:appuser package*.json ./
RUN npm install

# Copy source code
COPY --chown=appuser:appuser . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Set up non-root user first
RUN adduser --disabled-password --gecos '' appuser

# Create and set permissions for app directory
RUN mkdir -p /app && chown appuser:appuser /app

USER appuser
WORKDIR /app

# Copy built assets
COPY --from=builder --chown=appuser:appuser /app/.next ./.next
COPY --from=builder --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appuser /app/package.json ./package.json
COPY --from=builder --chown=appuser:appuser /app/src ./src

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000 || exit 1

# Start application
CMD ["npm", "start"]