# Nkem Aeronautics Backend

Separate Node.js/Express API for the Nkem Aeronautics platform.

## Stack

- Express
- Prisma ORM
- PostgreSQL on Neon
- JWT authentication
- bcrypt password and OTP hashing

## Environment

Create `server/.env` from `server/.env.example`:

```bash
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
JWT_SECRET=replace-with-a-long-random-string
CLIENT_ORIGIN=http://localhost:3000
OTP_PROVIDER=console
TERMII_API_KEY=replace-with-termii-api-key
TERMII_SENDER_ID=N-Alert
TERMII_CHANNEL=generic
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=nkemaeronautics@gmail.com
SMTP_PASS=replace-with-a-gmail-app-password
FLUTTERWAVE_SECRET_KEY=replace-with-flutterwave-secret-key
FLUTTERWAVE_WEBHOOK_HASH=replace-with-a-random-webhook-secret
```

Do not commit real database URLs or secrets.

## Commands

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
npm run create-admin -- --email admin@example.com --password "change-me" --name "Admin"
```

Local API URL: `http://localhost:5000/api`

Health check: `http://localhost:5000/health`
