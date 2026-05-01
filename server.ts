import { serve } from "@hono/node-server";
import { serveStaticFiles } from "./api/lib/vite";
import app from "./api/boot";

// For local / traditional server deployment (npm start)
serveStaticFiles(app);
const port = parseInt(process.env.PORT || "3000");
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
