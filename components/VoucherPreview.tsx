"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type KeyboardEvent,
} from "react";
import { Check, Eye, Layers2, Leaf, Maximize2 } from "lucide-react";
import { VoucherFront } from "@/components/VoucherFront";
import { VoucherBack } from "@/components/VoucherBack";
import { VoucherToolbar } from "@/components/VoucherToolbar";
import type { ExportAction, VoucherData, VoucherView } from "@/types/voucher";

function ScaledCard({
  children,
  hidden,
  label,
}: {
  children: ReactNode;
  hidden: boolean;
  label: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.min(entry.contentRect.width, 900)),
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="voucher-sheet" data-hidden={hidden} aria-hidden={hidden} inert={hidden}>
      <div className="sheet-heading">
        <span>{label}</span>
        <span>COMPLIMENTARY COLLECTION</span>
      </div>
      <div ref={container} className="voucher-scale-frame" style={{ height: (width * 2) / 3 }}>
        <div className="voucher-scale" style={{ transform: `scale(${width / 900})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

interface PreviewProps {
  data: VoucherData;
  view: VoucherView;
  setView: (view: VoucherView) => void;
  frontRef: RefObject<HTMLElement | null>;
  backRef: RefObject<HTMLElement | null>;
  includeMessage: boolean;
  busy: ExportAction | null;
  disabled: boolean;
  onExport: (action: ExportAction) => void;
}

export function VoucherPreview({
  data,
  view,
  setView,
  frontRef,
  backRef,
  includeMessage,
  busy,
  disabled,
  onExport,
}: PreviewProps) {
  const tabs: { value: VoucherView; label: string }[] = [
    { value: "front", label: "Front" },
    { value: "back", label: "Back" },
    { value: "both", label: "Show Both" },
  ];
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setView(tabs[next].value);
    document.getElementById(`tab-${tabs[next].value}`)?.focus();
  }
  return (
    <section className="preview-panel" aria-labelledby="preview-heading">
      <div className="preview-heading no-print">
        <div>
          <h2 id="preview-heading">Your voucher</h2>
          <p>A thoughtful stay, beautifully presented.</p>
        </div>
        <span className="live-badge">
          <span />
          Live preview
        </span>
      </div>
      <VoucherToolbar busy={busy} disabled={disabled} onExport={onExport} />
      <div className="preview-surface">
        <div className="preview-viewbar no-print">
          <div className="preview-tabs" role="tablist" aria-label="Voucher side">
            {tabs.map(({ value, label }, index) => (
              <button
                key={value}
                id={`tab-${value}`}
                role="tab"
                type="button"
                aria-selected={view === value}
                aria-controls="voucher-preview"
                tabIndex={view === value ? 0 : -1}
                onKeyDown={(event) => onTabKey(event, index)}
                onClick={() => setView(value)}
              >
                {value === "both" && <Layers2 size={13} />}
                {label}
              </button>
            ))}
          </div>
          <span className="aspect-hint">
            <Maximize2 size={12} /> 3:2 landscape
          </span>
        </div>
        <div
          className={`voucher-stage view-${view}`}
          id="voucher-preview"
          role="tabpanel"
          aria-labelledby={`tab-${view}`}
          tabIndex={0}
        >
          <ScaledCard hidden={view === "back"} label="01 / FRONT">
            <VoucherFront ref={frontRef} data={data} includeMessage={includeMessage} />
          </ScaledCard>
          <ScaledCard hidden={view === "front"} label="02 / BACK">
            <VoucherBack ref={backRef} data={data} />
          </ScaledCard>
        </div>
        <div className="preview-caption no-print">
          <span>
            <Eye size={14} /> Every detail, just as it will be shared.
          </span>
          <span>1800 × 1200 px</span>
        </div>
      </div>
      <div className="export-reassurance no-print">
        <span>
          <Check size={14} /> High-resolution PNG &amp; PDF
        </span>
        <span>
          <Check size={14} /> Both sides, print-ready
        </span>
        <span>
          <Leaf size={14} /> Made for a memorable stay
        </span>
      </div>
    </section>
  );
}
