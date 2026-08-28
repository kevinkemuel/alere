/** Chevron ascendente — eco del vértice del isotipo "A". Marca/bullet. */
export function ChevronMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 16 L12 8 L20 16" />
    </svg>
  );
}

/**
 * Divisor angular entre secciones (el "pliegue").
 * Se coloca dentro de una sección; dibuja un chevron del color indicado
 * que sobresale hacia la sección anterior/siguiente.
 */
export function SectionEdge({
  position = "top",
  colorClass = "text-paper",
  className = "",
}: {
  position?: "top" | "bottom";
  colorClass?: string;
  className?: string;
}) {
  const top = position === "top";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        top ? "top-0 -translate-y-[99%]" : "bottom-0 translate-y-[99%]"
      } ${colorClass} ${className}`}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block h-8 w-full sm:h-12"
        fill="currentColor"
      >
        {top ? (
          <path d="M0 60 L720 6 L1440 60 Z" />
        ) : (
          <path d="M0 0 L720 54 L1440 0 Z" />
        )}
      </svg>
    </div>
  );
}
