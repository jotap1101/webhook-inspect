import { CopyIcon } from "lucide-react";
import { Suspense } from "react";
import { IconButton } from "./ui/icon-button";
import { WebhooksList } from "./webhooks-list";

export function Sidebar() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-5">
        <div className="flex items-baseline">
          <span className="font-semibold text-zinc-100">webhook</span>
          <span className="font-normal text-zinc-400">.inspect</span>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-1 font-mono text-xs text-zinc-300">
          <span className="truncate">http://localhost:3333/api/capture</span>
        </div>
        <IconButton icon={<CopyIcon className="size-4" />} size="sm" />
      </div>
      <Suspense
        fallback={
          <div className="flex h-full items-start justify-center pt-5">
            Loading...
          </div>
        }
      >
        <WebhooksList />
      </Suspense>
    </div>
  );
}
