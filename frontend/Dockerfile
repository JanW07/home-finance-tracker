# --- Etap 1: build aplikacji React (Vite) ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Etap 2: serwowanie statycznych plików przez Nginx ---
FROM nginx:1.27-alpine

# UWAGA: Vite domyślnie builduje do katalogu "dist".
# Jeśli w Twoim vite.config.ts jest ustawione inne "build.outDir" (np. "build"),
# zmień poniższą linię na: COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80