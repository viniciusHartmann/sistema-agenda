FROM php:8.3-cli-alpine

# Instala dependências do sistema
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    curl \
    unzip \
    bash

# Instala extensões PHP necessárias para o Laravel
RUN docker-php-ext-install pdo pdo_sqlite

# Instala o Composer (gerenciador de pacotes PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copia apenas os arquivos de dependências primeiro (melhora o cache do Docker)
COPY composer.json composer.lock ./

# Instala as dependências PHP sem as de desenvolvimento
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copia o restante do código
COPY . .

# Cria o arquivo SQLite se não existir
RUN mkdir -p database && touch database/database.sqlite

# Ajusta permissões das pastas que o Laravel precisa escrever
RUN chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# Copia e torna o entrypoint executável
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
