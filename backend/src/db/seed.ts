import { db } from "@/db";
import { webhooksTable } from "@/db/schema/webhooks";
import { faker } from "@faker-js/faker";

// Eventos do Stripe
const stripeEvents = [
  "payment_intent.succeeded",
  "payment_intent.failed",
  "payment_intent.canceled",
  "payment_intent.processing",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.finalized",
  "charge.succeeded",
  "charge.failed",
  "charge.refunded",
  "customer.created",
  "customer.updated",
  "customer.deleted",
];

// Métodos HTTP possíveis
const httpMethods = ["POST", "GET", "PUT", "PATCH", "DELETE"] as const;

// Status codes por método HTTP
const statusCodesByMethod: Record<(typeof httpMethods)[number], number[]> = {
  // POST - Criação
  POST: [
    201, // Created (sucesso na criação)
    202, // Accepted (processamento assíncrono iniciado)
    400, // Bad Request
    401, // Unauthorized
    403, // Forbidden
    404, // Not Found (recurso pai não encontrado)
    409, // Conflict (recurso já existe)
    422, // Unprocessable Entity (validação falhou)
    429, // Too Many Requests
    500, // Internal Server Error
  ],
  // GET - Leitura
  GET: [
    200, // OK
    304, // Not Modified
    400, // Bad Request
    401, // Unauthorized
    403, // Forbidden
    404, // Not Found
    429, // Too Many Requests
    500, // Internal Server Error
  ],
  // PUT - Atualização completa
  PUT: [
    200, // OK (atualização bem sucedida)
    204, // No Content (atualização bem sucedida, sem retorno)
    400, // Bad Request
    401, // Unauthorized
    403, // Forbidden
    404, // Not Found
    409, // Conflict
    422, // Unprocessable Entity
    429, // Too Many Requests
    500, // Internal Server Error
  ],
  // PATCH - Atualização parcial
  PATCH: [
    200, // OK (atualização parcial bem sucedida)
    204, // No Content (atualização bem sucedida, sem retorno)
    400, // Bad Request
    401, // Unauthorized
    403, // Forbidden
    404, // Not Found
    409, // Conflict
    422, // Unprocessable Entity
    429, // Too Many Requests
    500, // Internal Server Error
  ],
  // DELETE - Remoção
  DELETE: [
    204, // No Content (remoção bem sucedida)
    400, // Bad Request
    401, // Unauthorized
    403, // Forbidden
    404, // Not Found
    409, // Conflict (não pode ser removido)
    429, // Too Many Requests
    500, // Internal Server Error
  ],
};

// Content types comuns em APIs
const contentTypes = [
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
  "application/xml",
];

// Headers comuns em requisições de webhook
const commonHeaders = {
  accept: ["*/*", "application/json", "application/xml"],
  "user-agent": [
    "Stripe/1.0 (+https://stripe.com/docs/webhooks)",
    "Mozilla/5.0 (compatible; StripeBot/1.0)",
    "Stripe-Webhook-Client/2023",
    "Node-Stripe-Webhook/1.0",
  ],
  "cache-control": ["no-cache", "no-store", "must-revalidate"],
  connection: ["keep-alive", "close"],
  "x-stripe-client-user-agent": [
    "{'lang': 'python', 'publisher': 'stripe', 'uname': 'Linux'}",
    "{'lang': 'node', 'publisher': 'stripe', 'uname': 'Linux'}",
    "{'lang': 'ruby', 'publisher': 'stripe', 'uname': 'Linux'}",
  ],
};

function generateStripeWebhookBody(event: string) {
  const customerId = `cus_${faker.string.alphanumeric(14)}`;
  const amount = faker.number.int({ min: 500, max: 100000 });
  const currency = faker.helpers.arrayElement(["usd", "eur", "brl"]);

  const baseData = {
    id: `evt_${faker.string.alphanumeric(24)}`,
    object: "event",
    api_version: "2023-10-16",
    created: Math.floor(faker.date.recent().getTime() / 1000),
    livemode: false,
    pending_webhooks: 0,
    request: {
      id: `req_${faker.string.alphanumeric(24)}`,
      idempotency_key: faker.string.uuid(),
    },
    type: event,
  };

  const dataObjects: Record<string, any> = {
    "payment_intent.succeeded": {
      object: "payment_intent",
      amount,
      currency,
      customer: customerId,
      payment_method: `pm_${faker.string.alphanumeric(24)}`,
      status: "succeeded",
    },
    "payment_intent.failed": {
      object: "payment_intent",
      amount,
      currency,
      customer: customerId,
      payment_method: `pm_${faker.string.alphanumeric(24)}`,
      status: "failed",
      last_payment_error: {
        code: faker.helpers.arrayElement([
          "card_declined",
          "expired_card",
          "insufficient_funds",
        ]),
        message: "Your card was declined.",
      },
    },
    "customer.subscription.created": {
      object: "subscription",
      id: `sub_${faker.string.alphanumeric(24)}`,
      customer: customerId,
      status: "active",
      current_period_start: Math.floor(faker.date.recent().getTime() / 1000),
      current_period_end: Math.floor(faker.date.future().getTime() / 1000),
      plan: {
        id: `plan_${faker.string.alphanumeric(16)}`,
        amount,
        currency,
        interval: faker.helpers.arrayElement(["month", "year"]),
      },
    },
    "invoice.paid": {
      object: "invoice",
      id: `in_${faker.string.alphanumeric(24)}`,
      customer: customerId,
      amount_paid: amount,
      currency,
      status: "paid",
      paid: true,
    },
    "charge.succeeded": {
      object: "charge",
      id: `ch_${faker.string.alphanumeric(24)}`,
      amount,
      currency,
      customer: customerId,
      payment_method_details: {
        type: "card",
        card: {
          brand: faker.helpers.arrayElement(["visa", "mastercard", "amex"]),
          last4: faker.string.numeric(4),
          exp_month: faker.number.int({ min: 1, max: 12 }),
          exp_year: faker.number.int({ min: 2024, max: 2030 }),
        },
      },
    },
  };

  return JSON.stringify(
    {
      ...baseData,
      data: {
        object: dataObjects[event] || {
          id: faker.string.alphanumeric(24),
          object: event.split(".")[0],
          customer: customerId,
        },
      },
    },
    null,
    2
  );
}

async function main() {
  console.log("Seeding database...");

  const webhooks = Array.from({ length: 50 }, () => {
    // Gera headers aleatórios
    function generateRandomHeaders(contentType: string) {
      const headers: Record<string, string> = {
        "content-type": contentType,
        "stripe-signature": `t=${Date.now()},v1=${faker.string.alphanumeric(64)}`,
      };

      // Adiciona alguns headers aleatórios da lista de headers comuns
      for (const [headerName, possibleValues] of Object.entries(
        commonHeaders
      )) {
        if (Math.random() > 0.3) {
          // 70% de chance de incluir cada header
          headers[headerName] = faker.helpers.arrayElement(possibleValues);
        }
      }

      return headers;
    }

    const event = faker.helpers.arrayElement(stripeEvents);
    const method = faker.helpers.arrayElement(httpMethods);
    const statusCode = faker.helpers.arrayElement(statusCodesByMethod[method]);
    const contentType = faker.helpers.arrayElement(contentTypes);
    const body = generateStripeWebhookBody(event);

    // Ajusta o corpo da resposta para status codes de erro
    const errorBody =
      statusCode >= 400
        ? JSON.stringify(
            {
              error: {
                type: "invalid_request_error",
                message: (() => {
                  switch (statusCode) {
                    case 400:
                      return "Invalid payload received";
                    case 401:
                      return "Invalid API key provided";
                    case 403:
                      return "Invalid webhook signature";
                    case 404:
                      return "Webhook endpoint not found";
                    case 429:
                      return "Too many webhook attempts";
                    case 500:
                      return "Internal server error";
                    default:
                      return "Unknown error";
                  }
                })(),
                code: statusCode,
                request_id: `req_${faker.string.alphanumeric(24)}`,
              },
            },
            null,
            2
          )
        : body;

    return {
      method,
      pathname: "/webhook/stripe",
      ip: faker.internet.ipv4(),
      statusCode,
      contentType,
      contentLength: Buffer.from(errorBody).length,
      queryParams: {
        token: faker.string.uuid(),
      },
      headers: generateRandomHeaders(contentType),
      body: errorBody,
      createdAt: faker.date.between({
        from: "2023-01-01",
        to: "2023-12-31",
      }),
    };
  });

  await db.insert(webhooksTable).values(webhooks);

  console.log("Database seeded successfully.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
