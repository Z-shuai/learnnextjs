FROM node:22-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy all files to the working directory
COPY . .

# Install dependencies
RUN pnpm install

FROM base AS builder

# Build the application
RUN pnpm run build

FROM node:22-alpine AS runner

# Install pnpm in the runner stage
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy the necessary files from the builder stage for the standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static .next/static

# Start the application
CMD ["node", "server.js"]

