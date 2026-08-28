import { Disponibilidad } from "@/lib/catalog/types";

const MAP: Record<Disponibilidad, { label: string; cls: string; dot: string }> = {
  disponible: {
    label: "Disponible",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  bajo: {
    label: "Pocas unidades",
    cls: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  agotado: {
    label: "Agotado",
    cls: "bg-gray-100 text-gray-500 ring-gray-500/20",
    dot: "bg-gray-400",
  },
};

export function StockBadge({
  estado,
  inventario,
  showQty = false,
}: {
  estado: Disponibilidad;
  inventario?: number;
  showQty?: boolean;
}) {
  const m = MAP[estado];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${m.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
      {showQty && estado !== "agotado" && typeof inventario === "number" && (
        <span className="font-normal opacity-70">· {inventario} u.</span>
      )}
    </span>
  );
}
