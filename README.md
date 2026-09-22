# ADARGA Soluções — Site Corporativo

Site para divulgação e venda de veículos para empresas, com serviço de consultoria
descritiva automotiva, atuação no mercado automotivo e de consórcios. Captura de
leads com atendimento continuado via WhatsApp.

## Stack

| Camada    | Tecnologia                          |
| --------- | ----------------------------------- |
| Frontend  | React 18 + Vite + React Router      |
| Backend   | TypeScript + Express + PostgreSQL   |
| Banco     | PostgreSQL 16 (via Docker Compose)  |

## Estrutura

```
.
├── client/            # Frontend React (Vite)
│   └── src/
│       ├── pages/     # Home, Catálogo, Login Admin, Painel Admin
│       └── components/# Navbar, CarCard, LeadModal, WhatsAppFloat...
├── server/            # Backend Express + TypeScript
│   └── src/
│       ├── routes/    # auth, cars, leads
│       ├── middleware/# auth (JWT)
│       └── schema.ts  # cria tabelas + admin padrão
└── docker-compose.yml # PostgreSQL
```

## Como rodar

Você pode rodar tudo a partir da raiz do projeto:

```bash
npm install            # instala dependências da raiz (inclui o concurrently)
npm run install:all    # instala dependências de server/ e client/
docker compose up -d   # sobe o PostgreSQL
npm run db:schema      # cria tabelas e o admin padrão
npm run dev            # sobe API (:3333) e site (:5173) juntos
```

Ou separadamente:

### 1. Banco de dados (PostgreSQL)

Pré-requisito: Docker Desktop rodando.

```bash
docker compose up -d
```

### 2. Backend

```bash
cd server
npm install
npm run db:schema     # cria tabelas e o admin padrão
npm run dev           # API em http://localhost:3333
```

### 3. Frontend

```bash
cd client
npm install
npm run dev           # site em http://localhost:5173
```

Acesse:

- Site público: `http://localhost:5173`
- Painel admin: `http://localhost:5173/admin`

## Acesso padrão do admin

Configurável em `server/.env` (campos `ADMIN_EMAIL` e `ADMIN_PASSWORD`):

- **E-mail:** `admin@adarga.com.br`
- **Senha:** `Adarga@2024`

> Altere a senha e o `JWT_SECRET` antes de publicar.

## Configuração do WhatsApp

Em `server/.env`, defina o número da empresa apenas com dígitos e DDI:

```
WHATSAPP_NUMBER=5511999999999
```

Esse número recebe os leads pelo link `wa.me` e também é usado pelo botão
flutuante e pelo botão do painel "Contatar lead".

## Funcionalidades

**Público**
- Home com serviços (venda B2B, consultoria descritiva, consórcios) e destaques.
- Catálogo com busca, filtro por combustível e ordenação por preço.
- Formulário de captura de lead (dados iniciais) por veículo ou consultoria
  geral; ao enviar, os dados são gravados no banco e o WhatsApp abre com o
  atendimento pré-preenchido.

**Admin (acesso único)**
- Login autenticado com JWT (somente o usuário admin cadastrado).
- CRUD completo do catálogo: adicionar, editar (inclusive destaque e status
  disponível/reservado/vendido) e excluir veículos.
- Gestão de leads: lista, status do funil (novo → contato → negociando →
  fechado/arquivado), botão direto de WhatsApp e exclusão.

## Produção

Build dos bundles:

```bash
cd server && npm run build && npm start
cd client && npm run build   # gera client/dist
```

Sirva `client/dist` com seu servidor web e faça o proxy de `/api` para a API.