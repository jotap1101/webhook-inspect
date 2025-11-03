import * as Dialog from "@radix-ui/react-dialog";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { webhookListSchema } from "../http/schemas/webhooks";
import { CodeBlock } from "./ui/code-block";
import { WebhooksListItem } from "./webhooks-list-item";

type GenerateHandlerResponse = {
  code: string;
};

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>(null);

  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([]);
  const [generatedHandlerCode, setGeneratedHandlerCode] = useState<
    string | null
  >(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["webhooks"],
      queryFn: async ({ pageParam }) => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/webhooks`);

        if (pageParam) {
          url.searchParams.set("cursor", pageParam);
        }

        const response = await fetch(url).then((res) => res.json());

        return webhookListSchema.parse(response);
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined;
      },
      initialPageParam: undefined as string | undefined,
    });

  const webhooks = data.pages.flatMap((page) => page.webhooks);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function handleCheckWebhook(checkedWebhookId: string) {
    if (checkedWebhooksIds.includes(checkedWebhookId)) {
      setCheckedWebhooksIds((prevCheckedWebhooksIds) =>
        prevCheckedWebhooksIds.filter((id) => id !== checkedWebhookId),
      );
    } else {
      setCheckedWebhooksIds((prevCheckedWebhooksIds) => [
        ...prevCheckedWebhooksIds,
        checkedWebhookId,
      ]);
    }
  }

  async function handleGenerateHandlerCode() {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/handler/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookIds: checkedWebhooksIds,
        }),
      },
    );

    const data: GenerateHandlerResponse = await response.json();

    setGeneratedHandlerCode(data.code);
  }

  const hasAnyWebhookChecked = checkedWebhooksIds.length > 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-1 p-2">
        <button
          disabled={!hasAnyWebhookChecked}
          className="mb-3 flex w-full items-center justify-center gap-3 rounded-lg bg-indigo-400 py-2 text-sm font-medium text-white disabled:opacity-50"
          onClick={() => handleGenerateHandlerCode()}
        >
          <Wand2 className="size-4" />
          Gerar handler
        </button>

        {webhooks.map((webhook) => {
          return (
            <WebhooksListItem
              key={webhook.id}
              webhook={webhook}
              onWebhookChecked={handleCheckWebhook}
              isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
            />
          );
        })}
      </div>

      {hasNextPage && (
        <div className="p-2" ref={loadMoreRef}>
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="size-5 animate-spin text-zinc-500" />
            </div>
          )}
        </div>
      )}

      {!!generatedHandlerCode && (
        <Dialog.Root defaultOpen>
          <Dialog.Overlay className="fixed inset-0 z-20 bg-black/60" />

          <Dialog.Content className="fixed top-1/2 left-1/2 z-40 flex max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <div className="max-h-[620px] w-[600px] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <CodeBlock language="typescript" code={generatedHandlerCode} />
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </div>
  );
}
