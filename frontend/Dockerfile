# Build da aplicação Vue.js
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos de dependências primeiro
COPY package*.json ./
RUN npm install

# Copia o restante do código e gera o build de produção
COPY . .
RUN npm run build

# Servir os arquivos com Nginx (imagem muito menor)
FROM nginx:1.25-alpine

# Remove a config padrão do Nginx e copia a nossa
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
