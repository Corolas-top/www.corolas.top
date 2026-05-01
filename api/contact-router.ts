import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactSubmissions } from "@db/schema";

export const contactRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        subject: z.string().min(1),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(contactSubmissions).values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      });
      return { id: Number(result[0].insertId), success: true };
    }),
});
