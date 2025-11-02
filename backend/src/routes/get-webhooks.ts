import { db } from "@/db";
import { webhooksTable } from "@/db/schema";
import { env } from "@/env";
import { desc, lt } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getWebhooksRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    `${env.API_ROUTE_PREFIX}/webhooks`,
    {
      schema: {
        summary: "Get Webhooks",
        description: "Retrieve a list of captured webhooks.",
        tags: ["Webhooks"],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(10),
          cursor: z.string().optional(),
        }),
        response: {
          200: z.object({
            webhooks: z.array(
              createSelectSchema(webhooksTable).pick({
                id: true,
                method: true,
                pathname: true,
                ip: true,
                contentType: true,
                contentLength: true,
                queryParams: true,
                headers: true,
                body: true,
                createdAt: true,
              })
            ),
            nextCursor: z.string().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit, cursor } = request.query;
      const result = await db
        .select()
        .from(webhooksTable)
        .where(cursor ? lt(webhooksTable.id, cursor) : undefined)
        .orderBy(desc(webhooksTable.id))
        .limit(limit + 1);
      const hasMore = result.length > limit;
      const webhooks = hasMore ? result.slice(0, limit) : result;
      const nextCursor = hasMore ? webhooks[webhooks.length - 1].id : undefined;

      return reply.status(200).send({
        webhooks,
        nextCursor,
      });
    }
  );
};
