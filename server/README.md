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
BREVO_API_KEY=replace-with-brevo-api-key
EMAIL_FROM_ADDRESS=nkem@nkemaeronautics.com
EMAIL_FROM_NAME=Nkem Aeronautics
```

Do not commit real database URLs or secrets.

## Commands

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
read -rsp "Admin password: " ADMIN_PASSWORD; echo
ADMIN_PASSWORD="$ADMIN_PASSWORD" npm run create-admin -- admin@example.com "Admin"
unset ADMIN_PASSWORD
```

Local API URL: `http://localhost:5000/api`

Health check: `http://localhost:5000/health`
