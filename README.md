# Next.js Authentication App

This is a Next.js application with authentication using shadcn/ui components and PostgreSQL database.

## Features

- User registration and login
- Modern UI components with shadcn/ui
- PostgreSQL database with Prisma ORM
- Local storage backup for form data
- Secure password hashing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your PostgreSQL database and update the `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

3. Run Prisma migrations:

```bash
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run dev
```

## Technologies Used

- Next.js 13+
- shadcn/ui
- PostgreSQL
- Prisma ORM
- bcryptjs for password hashing
