import { db } from "@/db";
import { webhooksTable } from "@/db/schema";
import { env } from "@/env";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const deleteWebhookRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    `${env.API_ROUTE_PREFIX}/webhooks/:id`,
    {
      schema: {
        summary: "Delete Webhook",
        description: "Delete a captured webhook.",
        tags: ["Webhooks"],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          204: z.void(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await db
        .delete(webhooksTable)
        .where(eq(webhooksTable.id, id))
        .returning();

      if (result.length === 0) {
        return reply.status(404).send({ message: "Webhook not found." });
      }

      return reply.status(204).send();
    }
  );
};
