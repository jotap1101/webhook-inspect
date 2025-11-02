import { createFileRoute } from "@tanstack/react-router";
import { SectionDataTable } from "../components/section-data-table";
import { SectionTitle } from "../components/section-title";
import { CodeBlock } from "../components/ui/code-block";
import { WebhookDetailHeader } from "../components/webhook-detail-header";

export const Route = createFileRoute("/webhooks/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const requestOverviewData = [
    {
      key: "Method",
      value: "POST",
    },
    {
      key: "Status Code",
      value: "200",
    },
    {
      key: "Content-Type",
      value: "application/json",
    },
    {
      key: "Content-Length",
      value: "342 bytes",
    },
    {
      key: "URL",
      value: "/video/status",
    },
    {
      key: "IP",
      value: "127.0.0.1",
    },
  ];

  const queryParametersData = [
    {
      key: "videoId",
      value: "abc123",
    },
    {
      key: "status",
      value: "processed",
    },
    {
      key: "resolution",
      value: "1080p",
    },
  ];

  const headersData = [
    {
      key: "User-Agent",
      value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    {
      key: "Accept",
      value: "application/json",
    },
    {
      key: "Authorization",
      value: "Bearer abcdef123456",
    },
    {
      key: "Host",
      value: "localhost:3333",
    },
    {
      key: "Connection",
      value: "keep-alive",
    },
  ];

  const requestBodyData = [
    {
      key: "event",
      value: "video.processed",
    },
    {
      key: "timestamp",
      value: "2024-04-10T14:23:45Z",
    },
    {
      key: "details",
      value: '{"duration": "5 mins", "size": "500MB"}',
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <WebhookDetailHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={requestOverviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Query Parameters</SectionTitle>
            <SectionDataTable data={queryParametersData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={headersData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Request Body</SectionTitle>
            <CodeBlock
              language="json"
              code={JSON.stringify(requestBodyData, null, 2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
