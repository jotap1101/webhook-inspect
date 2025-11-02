import { useSuspenseQuery } from "@tanstack/react-query";
import { webhookListSchema } from "../http/schemas/webhooks";
import { WebhooksListItem } from "./webhooks-list-item";

export function WebhooksList() {
  const { isPending, error, data } = useSuspenseQuery({
    queryKey: ["webhooks"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/webhooks`,
      ).then((res) => res.json());

      return webhookListSchema.parse(response);
    },
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-1 p-2">
        {data.webhooks.map((webhook) => {
          return <WebhooksListItem key={webhook.id} webhook={webhook} />;
        })}
      </div>
    </div>
  );
}
