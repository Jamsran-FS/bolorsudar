# Хуудас — frontend

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 storefront and admin panel for the Хуудас bookstore. API: [bolorsudar-backend](https://github.com/Jamsran-FS/bolorsudar-backend).

## Setup

```bash
npm install
cp .env.example .env.local   # API_URL (server) and NEXT_PUBLIC_API_URL (browser), default http://localhost:4000/api
npm run dev                  # http://localhost:3000 · admin at /admin
```

The backend must be running and seeded. Log in to `/admin` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from the backend `.env`.

## Pages

- **Storefront:** `/` home, `/books` catalog (filters, search, sort, pagination), `/books/[slug]` detail with reviews, `/cart` checkout, `/saved` wishlist, `/authors`. Below the `md` breakpoint it uses the mobile layout (drawer menu and bottom nav).
- **Admin:** dashboard, orders, books, categories, authors, review moderation, subscribers (CSV export).

Cart and wishlist live in `localStorage`. Store contact details and policy text that the mockups left as placeholders are in `src/lib/site.ts`.
