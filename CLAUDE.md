# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev      # Start development server
pnpm run build    # Production build
pnpm run start    # Production server
pnpm run lint     # Lint with Biome
pnpm run format   # Format with Biome (writes changes)
```

There are no test commands configured in this project.

## Architecture

This is a **Next.js 16 (App Router) full-stack delivery order management application** with integrated map visualization.

### Key Concepts

- **Multi-workspace**: Each user can have multiple workspaces; orders and customers are scoped per workspace
- **Map-centric**: The dashboard visualizes orders on an SK Tmap map with grouped markers by location
- **Server Actions**: All mutations go through Next.js Server Actions (`actions.ts` files), not API routes
- **Raw SQL**: Direct SQL via Neon serverless client — no ORM

### Directory Structure

```
src/
├── app/
│   ├── login/                          # Session-based auth (single password)
│   └── workspaces/[workspaceId]/
│       ├── dashboard/                  # Map view + order stats + workspace memo
│       ├── orders/                     # Order list, detail, bulk CSV upload
│       └── customers/                  # Customer master data management
├── components/
│   ├── client/                         # Client components (TMap wrapper, Textarea)
│   └── server/                         # Shared UI (Button, Input, Select)
├── services/
│   ├── auth/                           # Cookie-based session auth (7-day expiry)
│   ├── orders/                         # Order CRUD + bulk import logic
│   ├── customers/                      # Customer CRUD
│   ├── workspaces/                     # Workspace CRUD + memos
│   └── tmap/                           # SK Tmap address→coordinates API
├── core/
│   ├── db.ts                           # Neon DB client (converts nulls→undefined)
│   └── constants.ts
├── hooks/
│   └── useOrderBulkUpload.ts           # CSV import: parse → geocode → bulk insert
├── types/                              # Shared TypeScript types
└── utils/
```

### Data Flow

1. **Server Components** fetch initial data and enforce auth (`authService.getCurrentUser()` → redirect to `/login`)
2. **Client Components** use local `useState` for UI state
3. **Forms** use React Hook Form + Zod validation
4. **Mutations** call Server Actions which run raw SQL and revalidate Next.js cache
5. **Workspace memos** use debounced server actions to auto-save

### Authentication

Single-password session auth. All workspace routes check auth in Server Components. Session token stored in httpOnly cookie.

### Order Bulk Import

The `useOrderBulkUpload` hook handles CSV bulk import: PapaParse reads the file → each row's address is geocoded via Tmap API → `createOrdersBulkAction` bulk inserts all orders.

### Mapping (TMap)

SK Tmap v3 is used for the dashboard map. The `TMap` client component (`components/client/TMap/`) renders the map, grouped markers, and info windows showing orders per location.

### Database

Neon serverless PostgreSQL with raw SQL template strings. The `db.ts` wrapper normalizes `null` values to `undefined`. Schema is managed manually (no migrations tool configured).

## Environment Variables

```
STORAGE_DATABASE_URL          # Neon PostgreSQL connection string
NEXT_PUBLIC_TMAP_API_URL      # SK Tmap API base URL
NEXT_PUBLIC_TMAP_APP_KEY      # SK Tmap API key
```

## Tooling

- **Linter/Formatter**: Biome (not ESLint/Prettier) — run `npm run lint` and `npm run format`
- **TypeScript**: Strict mode, path alias `@/*` → `./src/*`
- **Styling**: Tailwind CSS 4 with PostCSS
