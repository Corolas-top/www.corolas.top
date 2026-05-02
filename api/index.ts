import { Hono } from "hono";

/**
 * Minimal Vercel Serverless Function entry point.
 * All auth is handled client-side via Supabase.
 * This keeps the API layer alive for future expansion.
 */
const app = new Hono();

app.get("/api/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.all("/api/*", (c) => c.json({ ok: true }));

export default app.fetch;
