import { db } from "@/db";
import { webhooksTable } from "@/db/schema";
import { env } from "@/env";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { inArray } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    `${env.API_ROUTE_PREFIX}/handler/generate`,
    {
      schema: {
        summary: "Generate Handler Code",
        description: "Generate code to handle selected webhooks.",
        tags: ["Handler"],
        body: z.object({
          webhookIds: z.array(z.string()),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { webhookIds } = request.body;
      const result = await db
        .select({
          body: webhooksTable.body,
        })
        .from(webhooksTable)
        .where(inArray(webhooksTable.id, webhookIds));
      const webhooksBodies = result.map((webhook) => webhook.body).join("\n\n");
      const { text } = await generateText({
        model: google("gemini-1.5-pro"),
        system: "You are a helpful assistant that generates TypeScript code.",
        prompt: `
          Generate a TypeScript function that serves as a handler for multiple webhook events. The function should accept a request body containing different webhook events and validate the incoming data using Zod. Each webhook event type should have its own schema defined using Zod.

          The function should handle the following webhook events with example payloads:

          """
          ${webhooksBodies}
          """

          The generated code should include:

          -  A main function that takes the webhook request body as input.
          -  Zod schemas for each event type.
          -  Logic to handle each event based on the validated data.
          -  Appropriate error handling for invalid payloads.

          ---

          You can use this prompt to request the TypeScript code you need for handling webhook events with Zod validation.

          Return only the code and do not return \`\`\`typescript or any other markdown symbols, do not include any introduction or text before or after the code.
        `.trim(),
      });

      return reply.status(201).send({
        code: text,
      });
    }
  );
};
