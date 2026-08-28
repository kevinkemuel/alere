import { ReactNode } from "react";

/**
 * Marquee horizontal continuo (CSS). Duplica el contenido para un loop
 * sin costuras y se pausa al pasar el cursor.
 */
export function Marquee({
  children,
  className = "",
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`group flex overflow-hidden ${className}`}>
      <div
        className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {children}
        <span aria-hidden className="flex items-center">
          {children}
        </span>
      </div>
    </div>
  );
}
