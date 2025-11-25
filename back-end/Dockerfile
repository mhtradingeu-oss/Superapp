FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install OpenSSL 1.1 compatibility libraries for Prisma engines (Debian)
RUN apt-get update && \
	apt-get install -y --no-install-recommends ca-certificates libssl1.1 openssl && \
	rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Copy prisma schema BEFORE installing so postinstall prisma generate can run
COPY prisma ./prisma

RUN npm ci

# Explicitly generate Prisma client (postinstall may already run this)
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-bullseye-slim AS runtime
WORKDIR /app

# Ensure runtime has required OpenSSL libs for Prisma
RUN apt-get update && \
	apt-get install -y --no-install-recommends ca-certificates libssl1.1 && \
	rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/server.js"]
