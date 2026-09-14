import { Download, FileDown, LoaderCircle, Printer } from "lucide-react";
import type { ExportAction } from "@/types/voucher";

const actions: { key: ExportAction; label: string; icon: typeof Download }[] = [
  { key: "front", label: "Download Front PNG", icon: Download },
  { key: "back", label: "Download Back PNG", icon: Download },
  { key: "pdf", label: "Download Both as PDF", icon: FileDown },
  { key: "print", label: "Print Voucher", icon: Printer },
];

export function VoucherToolbar({
  busy,
  disabled,
  onExport,
}: {
  busy: ExportAction | null;
  disabled: boolean;
  onExport: (action: ExportAction) => void;
}) {
  return (
    <div className="export-toolbar" aria-label="Export voucher">
      {actions.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className={`button ${key === "pdf" ? "button-primary" : "button-outline"}`}
          disabled={disabled || busy !== null}
          onClick={() => onExport(key)}
          aria-busy={busy === key}
        >
          {busy === key ? (
            <LoaderCircle size={15} className="spin" aria-hidden="true" />
          ) : (
            <Icon size={15} strokeWidth={1.6} aria-hidden="true" />
          )}
          <span>
            {busy === key ? (key === "print" ? "Preparing print…" : "Preparing…") : label}
          </span>
        </button>
      ))}
    </div>
  );
}
