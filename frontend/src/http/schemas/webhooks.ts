import { z } from "zod";

export const webhookListItemSchema = z.object({
  id: z.uuidv7(),
  method: z.string(),
  pathname: z.string(),
  createdAt: z.coerce.date(),
});

export const webhookListSchema = z.object({
  nextCursor: z.string().nullable(),
  webhooks: z.array(webhookListItemSchema),
});
