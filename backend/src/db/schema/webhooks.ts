import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const webhooksTable = pgTable("webhooks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  method: text("method").notNull(),
  pathname: text("pathname").notNull(),
  ip: text("ip").notNull(),
  statusCode: integer("status_code").notNull().default(200),
  contentType: text("content_type"),
  contentLength: integer("content_length"),
  queryParams: jsonb("query_params").$type<Record<string, string>>(),
  headers: jsonb("headers").notNull().$type<Record<string, string>>(),
  body: text("body"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
