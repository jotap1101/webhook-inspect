import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { IconButton } from "./ui/icon-button";

interface WebhooksListItemProps {
  webhook: {
    id: string;
    method: string;
    pathname: string;
    createdAt: Date;
  };
}

export function WebhooksListItem({ webhook }: WebhooksListItemProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteWebhook } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/webhooks/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["webhooks"],
      });

      router.navigate({ to: "/" });
    },
  });

  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox />
        <Link
          to="/webhooks/$id"
          params={{ id: webhook.id }}
          className="flex min-w-0 flex-1 items-start gap-3"
        >
          <span className="w-12 shrink-0 text-right font-mono text-xs font-semibold text-zinc-300">
            {webhook.method.toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs leading-tight text-zinc-200">
              {webhook.pathname}
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-500">
              {formatDistanceToNow(new Date(webhook.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </Link>
        <IconButton
          icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
          className="opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => deleteWebhook(webhook.id)}
        />
      </div>
    </div>
  );
}
