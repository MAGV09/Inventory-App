# Inventory Manager

A full-stack inventory management web application built with Node.js, Express, and PostgreSQL. Designed to manage products, categories, brands, vendors, and stock movements through a clean, responsive interface.

🔗 **[Live Demo]([https://your-live-url.onrender.com](https://inventory-app-782m.onrender.com/))** 

---

## Screenshots

| Products | Stock Movements |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/6627c879-5fea-4421-9d8d-e8fb7fe0d191" width="100%" alt="Products" /> | <img src="https://github.com/user-attachments/assets/104b300e-eebb-4f70-a290-43ee2c1921a7" width="100%" alt="Stock Movements" /> |

| Add Product | Vendors |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/c28969c7-69d5-41cc-b95d-8f8643ae2456" width="100%" alt="Add Product" /> | <img src="https://github.com/user-attachments/assets/7d806d9d-bd94-4348-bf70-548f55a1de4d" width="100%" alt="Vendors" /> |

---

## Features

- **Product Management** — Create, view, update, and delete products with full detail pages
- **Category & Brand Organization** — Group products by category and brand for easy filtering
- **Vendor Tracking** — Manage vendor records and link them to products via a junction table
- **Stock Movements** — Track inventory changes with a dedicated stock movements table
- **Safe Database Seeding** — Populate scripts use `ON CONFLICT` to safely re-run without duplicating data
- **Async Error Handling** — Leverages Express 5's automatic async error catching throughout the request cycle

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | PostgreSQL |
| Templating | EJS |
| Styling | Custom CSS (dark industrial design system) |
| HTTP Errors | http-errors |
| Environment | dotenv |

---

## Architecture

The project follows a strict **three-layer architecture** to keep concerns separated and the codebase maintainable:

```
routes → controllers → services → models → database
```

- **Models** — Raw database queries, nothing else
- **Services** — Business logic; orchestrate one or more model calls
- **Controllers** — Handle the HTTP request/response cycle and delegate to services

This pattern is maintained even for simple passthrough functions, keeping the architecture consistent throughout.

---

## Database Schema

Six tables with clearly defined relationships:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  categories │     │   brands    │     │   vendors   │
│─────────────│     │─────────────│     │─────────────│
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ name        │     │ name        │     │ name        │
│ description │     │ country     │     │ contact     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │         ┌─────────────────┐           │
       └────────►│    products     │◄──────────┘
                 │─────────────────│      (via vendor_products)
                 │ id (PK)         │
                 │ name            │
                 │ description     │
                 │ price           │
                 │ category_id (FK)│
                 │ brand_id (FK)   │
                 └────────┬────────┘
                          │
          ┌───────────────┴────────────────┐
          │                                │
┌─────────────────┐              ┌──────────────────┐
│ vendor_products │              │ stock_movements  │
│─────────────────│              │──────────────────│
│ vendor_id (FK)  │              │ id (PK)          │
│ product_id (FK) │              │ product_id (FK)  │
│ price           │              │ quantity         │
│ sku             │              │ movement_type    │
└─────────────────┘              │ created_at       │
                                 └──────────────────┘
```

All primary keys use `GENERATED ALWAYS AS IDENTITY`.

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/MAGV09/inventory-manager.git
cd inventory-manager
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**

Create a `.env` file in the root:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/inventory_db
PORT=3000
```

**4. Set up the database:**
```bash
# Create your PostgreSQL database
```

**5. Seed the database (optional):**
```bash
node prisma/populate.js postgresql://username:password@localhost:5432/inventory_db
```

> The populate script accepts the connection string as a `process.argv[2]` argument, keeping it decoupled from your `.env` file.

**6. Start the development server:**
```bash
npm run dev
```

The app will be running at `http://localhost:3000`.

---

## Project Structure

```
inventory-manager/
├── controllers/        # Route handlers — delegate to services
├── services/           # Business logic layer
├── models/             # Database query functions
├── routes/             # Express route definitions
├── views/              # EJS templates
│   └── partials/       # Reusable template fragments
├── public/             # Static assets (CSS, client-side JS)
├── db/                 # Database pool configuration
├── app.js              # Express app setup
└── server.js           # Entry point
```

---

## License

MIT
