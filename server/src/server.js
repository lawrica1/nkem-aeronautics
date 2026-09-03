import { createApp } from "./app.js";
import { connectDb } from "./config/prisma.js";
import { env } from "./config/env.js";

await connectDb();

const app = createApp();
app.listen(env.port, () => {
  console.log(`Nkem Aeronautics backend listening on http://localhost:${env.port}`);
});
