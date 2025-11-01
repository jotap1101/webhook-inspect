import { Link } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { IconButton } from "./ui/icon-button";

export function WebhooksListItem() {
  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox />
        <Link to="/" className="flex min-w-0 flex-1 items-start gap-3">
          <span className="w-12 shrink-0 text-right font-mono text-xs font-semibold text-zinc-300">
            POST
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs leading-tight text-zinc-200">
              /video/status
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-500">
              1 minute ago
            </p>
          </div>
        </Link>
        <IconButton
          icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </div>
  );
}
