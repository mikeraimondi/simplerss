# Build Stage
FROM oven/bun:1 AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

# Production Stage
FROM oven/bun:1-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.ts .
COPY --from=build /app/package.json .
COPY --from=build /app/bun.lock .

RUN bun install --production

EXPOSE 8080
CMD ["bun", "run", "server.ts"]
