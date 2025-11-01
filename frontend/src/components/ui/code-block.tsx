import { useEffect, useState, type ComponentProps } from "react";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

interface CodeBlockProps extends ComponentProps<"div"> {
  code: string;
  language?: string;
}

export function CodeBlock({
  code,
  language = "json",
  className,
  ...props
}: CodeBlockProps) {
  const [parsedCode, setParsedCode] = useState("");

  useEffect(() => {
    if (code) {
      codeToHtml(code, { lang: language, theme: "min-dark" }).then((parsed) =>
        setParsedCode(parsed),
      );
    }
  }, [code, language]);

  return (
    <div
      className={twMerge(
        "relative overflow-x-auto rounded-lg border border-zinc-700",
        className,
      )}
      {...props}
    >
      <div
        className="[&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: parsedCode }}
      />
    </div>
  );
}
