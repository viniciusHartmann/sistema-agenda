# Sistema Agenda de Contatos

Aplicação web de CRUD de contatos com isolamento por sessão de browser — cada usuário vê apenas seus próprios contatos, sem necessidade de login ou cadastro.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Laravel 13 (PHP 8.3) |
| Frontend | Vue 3 + TypeScript + Vite |
| Banco de dados | SQLite |
| Servidor de arquivos | Nginx |
| Containerização | Docker + Docker Compose |

## Funcionalidades

- Cadastro, edição e exclusão de contatos
- Campos: nome (obrigatório), e-mail, telefone com máscara brasileira e endereço
- Paginação configurável (5, 10 ou 15 contatos por página)
- Validação de formulário no frontend e mensagens de erro do servidor em PT-BR
- Notificações toast de sucesso/erro/aviso
- Isolamento por sessão: cada aba/browser tem sua própria lista de contatos

## Como rodar com Docker

> Pré-requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado.

```bash
git clone <url-do-repositorio>
cd sistema-agenda
docker compose up --build
