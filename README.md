# Routine Check - Web App & Browser Extension

This is a full-stack application that combines a Next.js web application with a browser extension for managing routines and calendar integration.

🌐 [Live Web App](https://routine-check-ext.vercel.app/)

## Features

- User authentication (registration and login)
- Routine management with calendar integration
- Browser extension for quick access to routines
- Modern UI components with shadcn/ui
- PostgreSQL database with Prisma ORM
- Real-time routine status updates
- Calendar view for routine scheduling
- Browser notifications and reminders
- Secure authentication with middleware protection

## Setup

### Web Application

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

### Browser Extension

1. Build the extension:

```bash
npm run build:extension
```

2. Load the extension in your browser:
   - Open Chrome/Edge and go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension/dist` folder

## Technologies Used

- Next.js 13+
- Chrome Extension Manifest V3
- shadcn/ui components
- PostgreSQL
- Prisma ORM
- TypeScript
- Tailwind CSS
- WebPack (for extension bundling)
- bcryptjs for password hashing

## Deployment

### Web Application

1. Deploy to your preferred hosting platform
2. Set up PostgreSQL database
3. Configure environment variables
4. Run database migrations

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"
```

### Browser Extension

1. Update API URLs in extension configuration
2. Build extension for production
3. Submit to Chrome Web Store
