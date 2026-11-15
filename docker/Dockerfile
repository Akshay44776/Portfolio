# Stage 1: build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG GIT_SHA=dev
ARG BUILD_TIME=unknown
ARG VITE_GITHUB_REPO=
ENV VITE_GIT_SHA=$GIT_SHA VITE_BUILD_TIME=$BUILD_TIME VITE_GITHUB_REPO=$VITE_GITHUB_REPO
RUN npm run build

# Stage 2: serve with Nginx
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/healthz || exit 1
