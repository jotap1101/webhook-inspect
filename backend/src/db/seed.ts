import { db } from "@/db";
import { webhooksTable } from "@/db/schema/webhooks";
import { seed } from "drizzle-seed";

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const statusCodes = [200, 201, 204, 400, 401, 403, 404, 500];
const contentTypes = [
  "application/json",
  "application/x-www-form-urlencoded",
  "text/plain",
  "multipart/form-data",
];
const pathnames = [
  "/api/webhooks/github",
  "/api/webhooks/stripe",
  "/api/webhooks/discord",
  "/api/webhooks/slack",
  "/api/notifications",
];
const sampleBodies = [
  JSON.stringify({
    event: "user.created",
    data: { id: "123", name: "John Doe" },
  }),
  JSON.stringify({ type: "payment.succeeded", amount: 2500, currency: "usd" }),
  JSON.stringify({ action: "issue.opened", repository: "webhook-inspect" }),
  "raw-text-payload",
  JSON.stringify({ message: "Webhook delivery failed", code: "ERR_TIMEOUT" }),
];

async function main() {
  await seed(db, { webhooks: webhooksTable }).refine((f) => ({
    webhooks: {
      count: 25,
      columns: {
        method: f.valuesFromArray({ values: httpMethods }),
        pathname: f.valuesFromArray({ values: pathnames }),
        ip: f.default({ defaultValue: "192.168.1.1" }),
        statusCode: f.valuesFromArray({ values: statusCodes }),
        contentType: f.valuesFromArray({ values: contentTypes }),
        contentLength: f.int({ minValue: 50, maxValue: 5000 }),
        queryParams: f.default({
          defaultValue: {
            token: f.uuid(),
            version: "1.0",
          },
        }),
        headers: f.default({
          defaultValue: {
            "user-agent": "GitHub-Hookshot/123abc",
            "x-github-delivery": f.uuid(),
            "x-github-event": "push",
            accept: "*/*",
            "content-type": "application/json",
          },
        }),
        body: f.valuesFromArray({ values: sampleBodies }),
        createdAt: f.date({
          minDate: "2023-01-01",
          maxDate: "2023-12-31",
        }),
      },
    },
  }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
