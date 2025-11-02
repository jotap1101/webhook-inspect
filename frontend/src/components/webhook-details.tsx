import { useSuspenseQuery } from "@tanstack/react-query";
import { SectionDataTable } from "../components/section-data-table";
import { SectionTitle } from "../components/section-title";
import { WebhookDetailHeader } from "../components/webhook-detail-header";
import { webhookDetailsSchema } from "../http/schemas/webhooks";
import { CodeBlock } from "./ui/code-block";

interface WebhookDetailsProps {
  id: string;
}

export function WebhookDetails({ id }: WebhookDetailsProps) {
  const { data } = useSuspenseQuery({
    queryKey: ["webhook", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/webhooks/${id}`,
      ).then((res) => res.json());

      return webhookDetailsSchema.parse(response);
    },
  });

  const requestOverviewData = [
    {
      key: "Method",
      value: data.method.toUpperCase(),
    },
    {
      key: "Status Code",
      value: String(data.statusCode),
    },
    {
      key: "Content Type",
      value: data.contentType || "N/A",
    },
    {
      key: "Content Length",
      value: data.contentLength ? `${data.contentLength} bytes` : "N/A",
    },
  ];
  const headersData = Object.entries(data.headers).map(([key, value]) => ({
    key,
    value,
  }));
  const queryParametersData = Object.entries(data.queryParams || {}).map(
    ([key, value]) => {
      return { key, value: String(value) };
    },
  );

  return (
    <div className="flex h-full flex-col">
      <WebhookDetailHeader {...data} />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={requestOverviewData} />
          </div>
          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={headersData} />
          </div>
          {queryParametersData.length > 0 && (
            <div className="space-y-4">
              <SectionTitle>Query Parameters</SectionTitle>
              <SectionDataTable data={queryParametersData} />
            </div>
          )}

          {!!data.body && (
            <div className="space-y-4">
              <SectionTitle>Request Body</SectionTitle>
              <CodeBlock code={data.body} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
