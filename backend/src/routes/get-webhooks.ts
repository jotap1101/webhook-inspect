import { env } from "@/env";
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
          offset: z.coerce.number().min(0).default(0),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              method: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { limit, offset } = request.query;

      // Placeholder: Replace with actual data retrieval logic
      const webhooks = Array.from({ length: limit }, (_, i) => ({
        id: `webhook_${offset + i + 1}`,
        method: "POST",
      }));

      return reply.status(200).send(webhooks);
    }
  );
};
