import { ReactNode } from "react";
import { ChevronMark } from "./Chevron";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className = "",
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start";
  const titleColor = tone === "dark" ? "text-white" : "text-ink";
  const descColor = tone === "dark" ? "text-white/60" : "text-support";
  return (
    <div className={`flex max-w-2xl flex-col ${alignCls} ${className}`}>
      {eyebrow && (
        <div
          className={`label mb-4 flex items-center gap-2 ${
            tone === "dark" ? "text-magenta-glow" : "text-magenta-500"
          }`}
        >
          {index && <span className="index-num opacity-60">{index}</span>}
          <ChevronMark className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
      )}
      <h2
        className={`font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.03] tracking-tight ${titleColor}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-lg leading-relaxed ${descColor}`}>{description}</p>
      )}
    </div>
  );
}
