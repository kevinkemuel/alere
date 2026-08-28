"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/site";

export function WhatsAppFAB() {
  const [show, setShow] = useState(false);

  // Aparece tras un pequeño scroll o pasado un momento, para no competir con el hero.
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={whatsappUrl(defaultWhatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-4 text-white shadow-[0_14px_40px_-10px_rgba(37,211,102,0.6)] transition-all duration-300 hover:bg-[#20bd5a] sm:bottom-7 sm:right-7 ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-60" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[10rem] sm:inline">
        Escríbenos
      </span>
    </a>
  );
}
