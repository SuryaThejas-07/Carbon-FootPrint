FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/database/prisma packages/database/prisma
RUN npm ci --workspaces --include-workspace-root

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace @carbonwise/database
RUN npm run build --workspace @carbonwise/shared
RUN npm run build --workspace @carbonwise/api

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./package.json
RUN rm -rf ./node_modules/@carbonwise/database ./node_modules/@carbonwise/shared
COPY --from=build /app/packages/database/dist ./node_modules/@carbonwise/database/dist
COPY --from=build /app/packages/database/package.json ./node_modules/@carbonwise/database/package.json
COPY --from=build /app/packages/shared/dist ./node_modules/@carbonwise/shared/dist
COPY --from=build /app/packages/shared/package.json ./node_modules/@carbonwise/shared/package.json
COPY --from=build /app/packages/database/prisma ./prisma
COPY --from=build /app/scripts/docker-entrypoint-api.sh ./docker-entrypoint-api.sh

RUN sed -i 's/\r$//' ./docker-entrypoint-api.sh && chmod +x ./docker-entrypoint-api.sh

EXPOSE 8080
CMD ["./docker-entrypoint-api.sh"]
