# Fintel — Finance Intelligence

> **Work on your finances today, for a better tomorrow.**

A full-stack AI-powered  finance intelligence application built with Next.js 15. Fintel helps users track income and expenses across multiple accounts, manage budgets, scan receipts with AI, automate recurring transactions, and receive intelligent monthly financial insights — all in one place.

🔗 **Live Demo:** [fintel-finance-intelligence.vercel.app](https://fintel-finance-intelligence.vercel.app)

---

## Features

### Core
- **Multi-Account Management** — Create and manage multiple bank accounts (Current/Savings), set a default account, and switch between them seamlessly
- **Transaction Management** — Full CRUD for income and expense transactions with category tagging, date selection, and description
- **Smart Filtering & Sorting** — Search, filter by type/recurring status, sort by date/amount/category/description, paginated table view
- **Bulk Delete** — Select and delete multiple transactions at once with balance auto-correction and confirmation gateway

### AI
- **Receipt Scanner** — Upload a receipt image and Gemini AI automatically extracts amount, date, merchant name, and category
- **Monthly Financial Insights** — AI-generated actionable insights delivered via email every month based on your spending patterns

### Automation (Inngest)
- **Recurring Transactions** — Set transactions as daily/weekly/monthly/yearly recurring — they get automatically added on schedule via background jobs
- **Budget Alerts** — Automated email alerts when monthly spending crosses 80% of your set budget (runs every 6 hours, no duplicate alerts per month)
- **Monthly Reports** — Automated email report on the 1st of every month with income/expense breakdown and AI insights

### Security
- **Rate Limiting** — Arcjet token bucket rate limiting on transaction creation (10 requests/hour per user)
- **Bot Protection** — Arcjet shield + bot detection at middleware level
- **Authentication** — Clerk-powered auth with OAuth support, protected routes

### UX
- **Dark/Light Mode** — Persistent theme toggle with no flash on load Light mode features a green-emerald gradient, dark mode uses a sleek slate-glass theme
- **Overdraft Protection** — Real-time warning when expense amount exceeds account balance, submit disabled until resolved
- **Responsive Design** — Fully mobile-friendly with Tailwind CSS
- **Data Visualizations** — Line chart (income vs expense over time with date range filters) and Donut pie chart (monthly expense breakdown by category)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS + Shadcn UI |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Clerk |
| AI | Google Gemini 2.5 Flash Lite |
| Background Jobs | Inngest |
| Security | Arcjet |
| Email | Resend + React Email |
| Charts | Recharts |
| Deployment | Vercel |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Next.js 15                  │
│         App Router + Server Actions          │
├──────────────┬──────────────────────────────┤
│   Security   │     Background Jobs           │
│   Layer      │     Layer (Inngest)           │
│              │                               │
│  • Arcjet    │  • Budget Alerts (6h cron)   │
│    Shield    │  • Recurring Transactions     │
│  • Bot       │    (daily cron)               │
│    Detection │  • Monthly Reports            │
│  • Rate      │    (1st of month cron)        │
│    Limiting  │                               │
├──────────────┴──────────────────────────────┤
│                  AI Layer                    │
│   Gemini 2.5 Flash Lite                     │
│   • Receipt OCR extraction                  │
│   • Financial insight generation            │
├─────────────────────────────────────────────┤
│              Data Layer                      │
│   PostgreSQL + Prisma + Supabase            │
│   • Atomic balance updates (db.$transaction)│
│   • Cascade deletes                         │
│   • Indexed queries                         │
└─────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Accounts for: Clerk, Arcjet, Inngest, Resend, Google AI Studio

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Arcjet
ARCJET_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Google Gemini
GEMINI_API_KEY=

# Resend Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

### Installation

```bash
# Clone the repo
git clone https://github.com/suhritareddy/fintel-finance-intelligence.git
cd fintel-finance-intelligence

# Install dependencies
npm install

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Schema

```
User
 └── Account (many)
      └── Transaction (many)
 └── Budget (one)
```

Key design decisions:
- All balance mutations use `db.$transaction` for atomicity — no partial updates
- Overdraft protection enforced at both server action and form level
- Indexes on `userId` and `accountId` for query performance
- Cascade deletes on all relations

---

## Key Implementation Highlights

**Atomic Balance Management**
Every transaction create/update/delete recalculates account balance inside a Prisma transaction — guaranteeing consistency even if the request fails midway.

**Inngest Background Jobs**
Three separate functions handle automation: budget alerts run every 6 hours with spam prevention via `lastAlertSent`, recurring transactions process daily with per-user throttling (10/min), and monthly reports run on the 1st with AI-generated insights.

**Arcjet Two-Layer Security**
Middleware-level shield + bot detection protects all routes globally. An additional token bucket rate limiter (10 req/hour per Clerk userId) specifically guards the transaction creation endpoint.

**AI Receipt Scanning**
Gemini 2.5 Flash Lite extracts structured JSON from receipt images. Strict validation ensures only responses with valid monetary amounts are accepted — non-receipts are rejected with user feedback.

---

## Project Structure

```
fintel-finance-intelligence/
├── app/
│   ├── (auth)/          # Clerk auth pages
│   ├── (main)/          # Protected app routes
│   │   ├── account/     # Account detail + chart
│   │   ├── dashboard/   # Main dashboard
│   │   └── transaction/ # Add/edit transactions
│   ├── api/inngest/     # Inngest webhook handler
│   └── lib/schema.js    # Zod validation schemas
├── actions/             # Next.js Server Actions
│   ├── accounts.js
│   ├── budget.js
│   ├── dashboard.js
│   ├── transaction.js
│   └── send-email.js
├── components/          # Shared UI components
├── lib/
│   ├── arcjet.js        # Arcjet config
│   ├── checkUser.js     # Auth sync with DB
│   ├── inngest/         # Background job functions
│   └── prisma.js        # Prisma client
├── emails/              # React Email templates
├── data/                # Static data (categories)
└── prisma/
    └── schema.prisma    # Database schema
```

---

## Deployment

Deployed on **Vercel** with automatic deployments on push to `main`.

Required environment variables must be set in Vercel dashboard. Inngest functions are served via the `/api/inngest` route and registered in the Inngest dashboard.

---



