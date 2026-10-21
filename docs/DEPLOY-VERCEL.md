# Website on Vercel

The Next.js website (`client/`) is deployed on Vercel as the project **nkem-web**.
The API (`server/`) is deployed separately on Render — see `DEPLOY-RENDER.md`.

## Project settings

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Framework Preset | Next.js |
| Production branch | `main` |

Every push to another branch gets its own **Preview** deployment link; pushes to `main` update production.

## Environment variables

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | The API address plus `/api`, e.g. `https://nkem-api.onrender.com/api` |

`NEXT_PUBLIC_API_URL` is built into the site, so redeploy after changing it.
Until it is set, pages and the product catalogue work, but sign-up, login, quotes and orders cannot reach the API.

## After the API is live

Add the Vercel address (e.g. `https://nkem-web.vercel.app`) to `CORS_ORIGINS` on the Render API service,
or set it as `CLIENT_ORIGIN` if Vercel is the main address of the site.
