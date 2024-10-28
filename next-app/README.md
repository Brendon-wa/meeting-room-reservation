# Reserva de Salas - Frontend

## Descrição

Este projeto é o frontend da aplicação de reserva de salas, desenvolvido em React e Next.js. Ele se comunica com a API REST do backend para gerenciar reservas de salas.

## Funcionalidades

### Para Usuários

- **Cadastro de usuários**: Permite que novos usuários se registrem na plataforma.
- **Login e autenticação**: Usuários podem acessar suas contas com segurança.
- **Visualizar salas disponíveis**: Lista todas as salas que podem ser reservadas.
- **Criar uma reserva**: Usuários podem fazer reservas de salas, especificando data e horário.
- **Listar reservas existentes**: Usuários podem visualizar suas reservas.
- **Atualizar uma reserva**: Usuários podem modificar detalhes de reservas existentes.
- **Cancelar uma reserva**: Permite que usuários cancelem suas reservas.

### Para Administradores

- **Listar todas as reservas**: Administradores podem visualizar todas as reservas feitas por todos os usuários.
- **Gerenciar salas**: Acesso à funcionalidade de criação, edição e exclusão de salas.
- **Listar usuários**: Administradores podem visualizar todos os usuários cadastrados.

## Tecnologias Utilizadas

- **Next.js**: 14.2.15
- **React**: 18
- **ReactDOM**: 18

### Dependências

- **@hookform/resolvers**: ^3.9.0
- **axios**: ^1.7.7
- **dayjs**: ^1.11.13
- **lucide-react**: ^0.453.0
- **nookies**: ^2.5.2
- **react-day-picker**: ^9.2.0
- **react-hook-form**: ^7.53.1
- **zod**: ^3.23.8

## Ambiente Necessário

- **Node.js**: 20.15.1
- **NPM**: 10.7.0

## Instruções de Instalação e Execução

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Brendon-wa/meeting-room-reservation
   cd next-app

2. **Instale as dependências do projeto:**

```npm install```

3. **Crie e configure o arquivo .env para realizar requisições no back-end**

```NEXT_PUBLIC_API_URL = 'http://localhost:8000/api'```

3. **Inicie o servidor de desenvolvimento**

```npm run dev```
