#!/bin/bash
set -e

echo "==> Iniciando o backend Laravel..."

# Gera a APP_KEY se não estiver definida
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "==> Gerando APP_KEY..."
    php artisan key:generate --force
fi

# Garante que o arquivo SQLite existe
if [ ! -f "database/database.sqlite" ]; then
    echo "==> Criando arquivo do banco SQLite..."
    touch database/database.sqlite
fi

# Roda as migrations (cria as tabelas no banco)
echo "==> Rodando migrations..."
php artisan migrate --force

# Limpa e recria os caches de configuração
echo "==> Otimizando configurações..."
php artisan config:cache
php artisan route:cache

echo "==> Tudo pronto! Subindo o servidor na porta 8000..."
php artisan serve --host=0.0.0.0 --port=8000
