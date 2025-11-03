import { env } from "@/env";
import { app } from "@/server";
import z from "zod";

export const healthyRoute = () => {
  app.get(
    `${env.API_ROUTE_PREFIX}/healthy`,
    {
      schema: {
        summary: "Health Check",
        description: "Check if the server is healthy.",
        tags: ["Health"],
        response: {
          200: z.object({
            status: z.literal("ok"),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send({
        status: "ok",
      });
    }
  );
};
