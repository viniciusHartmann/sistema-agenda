#!/bin/bash
set -e

echo "==> Iniciando o backend Laravel..."

# Cria o .env a partir do .env.example se não existir
# (o .env não é commitado por segurança; o .env.example serve como template)
if [ ! -f ".env" ]; then
    echo "==> Criando .env a partir do .env.example..."
    cp .env.example .env
fi

# Gera a APP_KEY se não estiver definida no .env
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
