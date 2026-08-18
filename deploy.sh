#!/usr/bin/env bash
set -euo pipefail

# Uruchamiaj ten skrypt z katalogu głównego repo na serwerze, np.:
#   ./deploy.sh
# lub zdalnie:
#   ssh user@serwer "cd /opt/financetracker && ./deploy.sh"

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

BRANCH="${1:-main}"   # domyślnie "main", można podać inny branch jako argument

if [ ! -f ".env" ]; then
    echo "BŁĄD: brak pliku .env w $REPO_DIR"
    echo "Skopiuj .env.example do .env i uzupełnij wartości przed pierwszym uruchomieniem."
    exit 1
fi

echo "==> Pobieranie najnowszej wersji z gałęzi '$BRANCH'..."
git fetch origin
git reset --hard "origin/$BRANCH"
chmod +x deploy.sh

echo "==> Budowanie obrazów (bez cache warstw bazowych)..."
docker compose --env-file .env build --pull

echo "==> Restart kontenerów..."
docker compose --env-file .env up -d --remove-orphans

echo "==> Sprzątanie nieużywanych obrazów..."
docker image prune -f

echo "==> Status:"
docker compose ps

echo "==> Gotowe. Logi na żywo: docker compose logs -f"