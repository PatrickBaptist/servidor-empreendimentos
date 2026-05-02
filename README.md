Backend — Cadastro e Listagem de Usuários
API REST desenvolvida com Node.js + TypeScript + Express + Prisma + PostgreSQL.

Stack

Node.js + TypeScript
Express — framework HTTP
Prisma ORM v7 — acesso ao banco com tipagem
PostgreSQL 16 — banco de dados (via Docker)
Zod — validação de input
dotenv — variáveis de ambiente


Estrutura do projeto
src/
├── server.ts                      # Entrypoint — sobe o servidor
├── app.ts                         # Configuração do Express e rotas
├── lib/
│   └── prisma.ts                  # Singleton do PrismaClient com adapter
├── validations/
│   └── user.ts                    # Schema de validação Zod
├── services/
│   └── user.service.ts            # Regras de negócio e acesso ao banco
├── controllers/
│   └── user.controller.ts         # Recebe req/res, chama service
└── routes/
    └── user.routes.ts             # Mapeamento de rotas
prisma/
├── schema.prisma                  # Model User
└── seed.ts                        # Dados iniciais
prisma.config.ts                   # Configuração do Prisma 7

Pré-requisitos

Node.js v18+
Docker Desktop


Como rodar
1. Instalar dependências
bashnpm install
2. Configurar variáveis de ambiente
bashcp .env.example .env
Edite o .env:
envDATABASE_URL="postgresql://postgres:postgres@localhost:5433/user_api_db"
PORT=3000
NODE_ENV=development

Porta 5433 porque o Docker está mapeado nessa porta para evitar conflito com PostgreSQL local.

3. Subir o banco com Docker
bashdocker compose up -d
4. Rodar a migration
bashnpx prisma migrate dev --name init
5. Gerar o client do Prisma
bashnpx prisma generate
6. Iniciar o servidor
bashnpm run dev
Servidor disponível em http://localhost:3000.

Endpoints
POST /users — Cadastrar usuário
bashcurl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com"}'
Resposta 201 — Sucesso:
json{
  "success": true,
  "message": "Usuário cadastrado com sucesso!",
  "data": {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2026-05-02T22:00:00.000Z"
  }
}
Resposta 422 — Campos inválidos:
json{
  "success": false,
  "error": "Dados inválidos",
  "details": [
    { "field": "email", "message": "E-mail inválido" }
  ]
}
Resposta 409 — E-mail duplicado:
json{
  "success": false,
  "error": "Este e-mail já está cadastrado"
}

GET /users — Listar usuários
bashcurl http://localhost:3000/users
Resposta 200:
json{
  "success": true,
  "data": [
    {
      "id": "clxyz...",
      "name": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2026-05-02T22:00:00.000Z"
    }
  ]
}

Boas práticas aplicadas

Camadas separadas — validação, regra de negócio e HTTP em arquivos distintos
Erro semântico — EmailAlreadyExistsError em vez de tratar string de erro do banco
Código P2002 do Prisma — violação de unique constraint tratada explicitamente no service
Select explícito — Prisma nunca retorna campos desnecessários (ex: updatedAt)
Singleton do PrismaClient — evita múltiplas conexões abertas
Zod — valida e tipifica o input ao mesmo tempo, sem duplicar tipos


Uso de IA
A IA foi utilizada como apoio durante o desenvolvimento:

Ajudou na configuração do Docker Compose para subir o PostgreSQL localmente
Auxiliou na análise e resolução dos erros que foram aparecendo durante o processo, como conflito de porta e configuração do Prisma 7

O que foi feito manualmente:

Toda a estrutura de código, camadas e lógica da API
Decisões de arquitetura e organização do projeto