import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "white" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-magenta-500 text-white shadow-[var(--shadow-brand)] hover:bg-magenta-600 hover:-translate-y-0.5",
  outline:
    "border-2 border-magenta-500 text-magenta-600 hover:bg-magenta-50",
  ghost: "text-magenta-600 hover:bg-magenta-50",
  white:
    "bg-white text-magenta-600 shadow-[var(--shadow-soft)] hover:bg-magenta-50 hover:-translate-y-0.5",
  whatsapp:
    "bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.5)] hover:bg-[#20bd5a] hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-8 py-4 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  external,
  type = "button",
  onClick,
  disabled,
}: CommonProps & {
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
