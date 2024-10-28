# Reserva de Salas - API REST (Backend)

## Descrição

Este projeto consiste em uma API REST desenvolvida em PHP com o framework Laravel, destinada a gerenciar reservas de salas. A API permite operações CRUD (Criar, Ler, Atualizar e Deletar) para as reservas e também possui uma área administrativa para gerenciar usuários e salas.

## Funcionalidades

### Para Usuários

- **Cadastro de usuários**
- **Autenticação de usuários**
- **Criar uma reserva**
- **Ler reservas existentes**
- **Atualizar uma reserva**
- **Deletar uma reserva**

### Para Administradores

- **CRUD para Salas**
- **Listagem de Reservas**
- **Listagem de Usuários**

### Campos da Reserva

- **room_id**, **user_id**, **room_name**, **user_name**, **date**, **start_time**, **end_time**, **status**

### Validações

- A sala não pode ser reservada duas vezes no mesmo horário.
- Reservas não podem ser feitas para datas e horas no passado.

## Tecnologias Utilizadas

- PHP: 8.2.12
- Laravel: ^10.10
- PostgreSQL: 16.3

## Ambiente Necessário

- **PHP**: 8.2 ou superior
- **Node.js**: 14.x ou superior (se precisar para outros scripts)
- **Laravel**: ^10.10
- **PostgreSQL**: 16.3

## Estrutura do Banco de Dados

### SQL para criação da base de dados

```sql
CREATE DATABASE meeting_room_reservation;

\c meeting_room_reservation;

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    value FLOAT,
    photos VARCHAR(255) DEFAULT 'room.png' NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_name VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## Instruções de Instalação e Execução

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu_usuario/reserva_salas.git
   cd reserva_salas/backend```

2. **Instale as dependências do Laravel:**

```composer install```

3. **Configure o arquivo .env para acessar a base de dados**

```DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=meeting_room_reservation
DB_USERNAME=postgres
DB_PASSWORD=postgres```

4. **Execute as migrations**

```php artisan migrate```

5. **Execute os seeders(Irá gerar um usuário admin)**

```php artisan db:seed --class=AdminUserSeeder```

6. **Caso queira gerar salas com seeder, sem usar api ou painel admin, rodar seed para salas**

```php artisan db:seed --class=RoomSeeder```

7. **Inicie o servidor local**

```php artisan serve```

Documentação da API REST

1. Endpoints de Autenticação

Login

URL: POST http://localhost:8000/api/login
Descrição: Permite que os usuários façam login na aplicação. Requer credenciais do usuário e, em caso de sucesso, retorna um token de autenticação.
Request Body: { "email": "user@mail.com", "password": "12345678" }
Exemplo de chamada com Postman:
Método: POST
URL: http://localhost:8000/api/login
Aba "Body": selecione "raw" e escolha "JSON" como formato. Cole o JSON acima.

Registro

URL: POST http://127.0.0.1:8000/api/register
Descrição: Permite que novos usuários se registrem na aplicação, fornecendo suas informações básicas.
Request Body: { "name": "user", "email": "user@mail.com", "password": "12345678" }
Exemplo de chamada com Postman:
Método: POST
URL: http://127.0.0.1:8000/api/register
Aba "Body": selecione "raw" e escolha "JSON" como formato. Cole o JSON acima.

Obter Informações do Usuário

URL: GET http://127.0.0.1:8000/api/user
Descrição: Retorna as informações do usuário autenticado. Requer um token de autenticação no cabeçalho da requisição.
Cabeçalhos: Authorization: Bearer <Token>
Exemplo de chamada com Postman:
Método: GET
URL: http://127.0.0.1:8000/api/user
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Clique em "Send" para fazer a requisição.

Obter Todas as Salas

URL: GET http://localhost:8000/api/rooms/all
Descrição: Retorna uma lista de todas as salas disponíveis. Requer um token de autenticação no cabeçalho da requisição.
Exemplo de chamada com Postman:
Método: GET
URL: http://localhost:8000/api/rooms/all
Clique em "Send" para fazer a requisição.

Obter Horários Disponíveis por Sala

URL: GET http://localhost:8000/api/rooms?date=2024-10-30&room_id=2
Descrição: Retorna as salas disponíveis para a data especificada. Requer um token de autenticação no cabeçalho da requisição.
Cabeçalhos: Authorization: Bearer <Token>
Exemplo de chamada com Postman:
Método: GET
URL: http://localhost:8000/api/rooms?date=2024-10-30&room_id=2
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Clique em "Send" para fazer a requisição.

Obter Detalhes da Sala

URL: GET http://localhost:8000/api/room/1
Descrição: Retorna os detalhes de uma sala específica, identificada pelo seu ID. Este endpoint não requer autenticação.
Exemplo de chamada com Postman:
Método: GET
URL: http://localhost:8000/api/room/1
Clique em "Send" para fazer a requisição.

Obter Horários Disponíveis para Fim de Reserva

URL: GET http://localhost:8000/api/rooms/endTime?room_id=1&date=2024-10-26&start_time=19:00
Descrição: Retorna os horários disponíveis para o fim da reserva, com base na data, ID da sala e horário de início fornecidos.
Exemplo de chamada com Postman:
Método: GET
URL: http://localhost:8000/api/rooms/endTime?room_id=1&date=2024-10-26&start_time=19:00
Clique em "Send" para fazer a requisição.

Obter Reservas

URL: GET http://localhost:8000/api/bookings
Descrição: Retorna a lista de reservas do usuário autenticado. Este endpoint requer autenticação.
Cabeçalhos: Authorization: Bearer <Token>
Exemplo de chamada com Postman:
Método: GET
URL: http://localhost:8000/api/bookings
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Clique em "Send" para fazer a requisição.

Obter Detalhes da Reserva

URL: GET http://localhost:8000/api/bookings/3/224
Descrição: Retorna os detalhes de uma reserva específica, identificada pelo ID da sala e pelo ID da reserva. Este endpoint requer autenticação.
Cabeçalhos: Authorization: Bearer <Token>
Exemplo de chamada com Postman:
Método: GET
URL: http://localhost:8000/api/bookings/3/224
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Clique em "Send" para fazer a requisição.

Criar Nova Reserva

URL: POST http://localhost:8000/api/booking
Descrição: Permite que um usuário crie uma nova reserva de sala. Este endpoint requer autenticação.
Request Body: { "room_id": 2, "date": "2024-10-30", "start_time": "18:00", "end_time": "20:00" }
Exemplo de chamada com Postman:
Método: POST
URL: http://localhost:8000/api/booking
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Na aba "Body", selecione "raw" e escolha "JSON" como formato. Cole o JSON acima.
Clique em "Send" para fazer a requisição.

Cancelar Reserva

URL: PUT http://localhost:8000/api/booking/cancel/103
Descrição: Cancela uma reserva específica, identificada pelo seu ID. Este endpoint requer autenticação.
Cabeçalhos: Authorization: Bearer <Token>
Exemplo de chamada com Postman:
Método: PUT
URL: http://localhost:8000/api/booking/cancel/103
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Clique em "Send" para fazer a requisição.

Atualizar Reserva

URL: PUT http://localhost:8000/api/booking/295
Descrição: Permite que um usuário atualize os detalhes de uma reserva existente, identificada pelo seu ID. Este endpoint requer autenticação.
Request Body: { "room_id": 5, "date": "2024-12-30", "start_time": "18:00", "end_time": "20:00" }
Exemplo de chamada com Postman:
Método: PUT
URL: http://localhost:8000/api/booking/295
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Na aba "Body", selecione "raw" e escolha "JSON" como formato. Cole o JSON acima.
Clique em "Send" para fazer a requisição.

2. Admin

Listar Usuários (Admin)

URL: GET http://127.0.0.1:8000/api/users
Descrição: Retorna uma lista de todos os usuários registrados no sistema. Este endpoint requer autenticação e o usuário deve ser um admin.
Cabeçalhos: Authorization: Bearer <Token>
Exemplo de chamada com Postman:
Método: GET
URL: http://127.0.0.1:8000/api/users
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Clique em "Send" para fazer a requisição.

Listar Todas Reservas (Admin)

URL: GET http://localhost:8000/api/bookings/admin
Descrição: Retorna uma lista de todas as reservas no sistema. Este endpoint requer autenticação e o usuário deve ser um admin.
Cabeçalhos: Authorization: Bearer <Token>
Exemplo de chamada com Postman:
Método: GET
URL: http://localhost:8000/api/bookings/admin
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Clique em "Send" para fazer a requisição.

Criar Nova Sala (Admin)

URL: POST http://localhost:8000/api/room
Descrição: Permite que um admin crie uma nova sala no sistema.
Request Body: { "name": "Sala 10", "capacity": 20 }
Exemplo de chamada com Postman:
Método: POST
URL: http://localhost:8000/api/room
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Na aba "Body", selecione "raw" e escolha "JSON" como formato. Cole o JSON acima.
Clique em "Send" para fazer a requisição.

Deletar Sala (Admin)

URL: DELETE http://localhost:8000/api/room/5
Descrição: Permite que um admin delete uma sala específica, identificada pelo seu ID.
Exemplo de chamada com Postman:
Método: DELETE
URL: http://localhost:8000/api/room/5
Na aba "Headers", adicione: Key: Authorization, Value: Bearer <Token>
Clique em "Send" para fazer a requisição.
