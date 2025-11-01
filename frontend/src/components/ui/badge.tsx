import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={twMerge(
        "rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1 font-mono text-sm font-semibold text-zinc-100",
        className,
      )}
      {...props}
    />
  );
}
