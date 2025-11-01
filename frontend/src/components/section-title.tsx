import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function SectionTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={twMerge("text-base font-semibold text-zinc-100", className)}
      {...props}
    />
  );
}
