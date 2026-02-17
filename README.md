# Car Rental Website (Catálogo + Painel Admin)

Este projeto é um **website de exposição** (catálogo) com um **painel admin** para:
- marcar o estado do veículo: **Disponível / Indisponível / Manutenção**
- **adicionar** e **editar** veículos
- **arquivar/desativar** veículos (não aparecem no catálogo)

⚠️ **Não existe reserva dentro do sistema.** O visitante é direcionado para **WhatsApp** ou **e-mail**.

## 1) Requisitos
- Node.js 18+
- PNPM (recomendado)
- MySQL 8+

## 2) Configuração
1. Copie `.env.example` para `.env` e ajuste:
   - `DATABASE_URL`
   - `ADMIN_EMAIL` e `ADMIN_PASSWORD` (admin inicial)
   - `NEXT_PUBLIC_CONTACT_WHATSAPP_E164` e `NEXT_PUBLIC_CONTACT_EMAIL`

2. Instale dependências:
```bash
pnpm install
```

3. Gere as tabelas (Prisma):
```bash
pnpm db:migrate
pnpm db:seed
```

4. Rode em desenvolvimento:
```bash
pnpm dev
```

Abra:
- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## 3) Login Admin
- A página de login é `/admin/login`.
- Depois do seed, use `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

## 4) Alternativa: SQL direto
Se você preferir criar tabelas manualmente, existe `database/init.sql`.

## 5) Estrutura
- `app/` — Next.js (App Router)
- `app/api/` — APIs (login/logout e CRUD de veículos)
- `prisma/` — schema + seed
- `components/` — UI

