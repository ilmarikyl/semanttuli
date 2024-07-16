FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build the app
COPY . .
RUN npm run build

# Start a new stage for a smaller final image
FROM node:20-alpine AS production

LABEL Developers="Ilmari Kylliäinen"

WORKDIR /app

# Copy built assets and package files from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Use non-root user
USER node

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "build"]