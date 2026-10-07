# Kopi Kita

Kopi Kita is a warm, modern coffee-shop web application featuring a database-backed catalog, table booking flow, and protected administrative CMS. The public interface allows guests to explore products and make table reservations, while the back-office CMS empowers staff to manage products, categories, stock availability, and reservations.

## Key Features

- **Guest Portal:**
  - Modern, responsive landing page, interactive menu, and booking pages.
  - Category filtering, stock status indicators, loading states, and error recovery.
  - Client-side and server-side table reservation validation.

- **Admin CMS:**
  - Protected back-office for managing coffee and food products.
  - Real-time stock status toggles and manual booking status updates.
  - Database-backed HttpOnly session authentication surviving application restarts.

- **Robust Architecture:**
  - Monorepo architecture with Next.js frontend proxying `/api/*` to a standalone Express API.
  - Structured PostgreSQL database with numbered SQL migrations executed on startup.
  - Containerized with Docker Compose for seamless local development and production deployment.

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Motion
- **Backend:** Node.js, Express, TypeScript, Zod
- **Database:** PostgreSQL with automated migrations
- **Infrastructure:** Docker, Docker Compose, Nginx

## Repository Structure

```text
kopi-kita/
├── apps/
│   ├── api/          # Express API, PostgreSQL access, and migrations
│   └── web/          # Next.js web application and UI components
├── packages/
│   └── shared/       # Shared Zod validation schemas and TypeScript types
├── docker-compose.yml # Multi-container Docker configuration
└── README.md
```

## Quick Start (Docker)

1. Clone this repository and ensure Docker Desktop is running.
2. Prepare environment variables:
   ```bash
   cp .env.example .env
   ```
3. Build and launch services:
   ```bash
   docker compose up --build
   ```
4. Access the web app at `http://localhost:3030` and the API at `http://localhost:4000`.

## Local Development

Start PostgreSQL in Docker, then run the Node applications:

```bash
docker compose up -d db
npm install
npm run dev
```

- Web interface: `http://localhost:3000`
- Express API: `http://localhost:4000`

## License

This project is open-source and created for educational and practical development purposes.
