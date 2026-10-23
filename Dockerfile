# Builds and runs apps/web. Railway deploys this file on every push to main.
FROM node:24-slim AS build
RUN npm install -g --ignore-scripts=false @endevco/aube@2.8.1
WORKDIR /repo
COPY . .
RUN aube install --frozen-lockfile && aube run build

# Nitro bundles every dependency into .output, so the runtime image needs only Node.
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/apps/web/.output .output
CMD ["node", ".output/server/index.mjs"]
