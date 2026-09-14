"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type KeyboardEvent,
} from "react";
import { Check, Eye, Layers2, Leaf, Maximize2, MousePointer2, Undo2, Redo2 } from "lucide-react";
import { VoucherFront } from "@/components/VoucherFront";
import { VoucherBack } from "@/components/VoucherBack";
import { VoucherToolbar } from "@/components/VoucherToolbar";
import type { ExportAction, VoucherData, VoucherView } from "@/types/voucher";
import { CanvasEditor } from "@/components/CanvasEditor";
import type { DesignerController } from "@/lib/useDesigner";
import type { DesignSide } from "@/types/design";

function ScaledCard({
  children,
  hidden,
  label,
  designer,
  side,
  includeMessage,
  disabled,
}: {
  children: ReactNode;
  hidden: boolean;
  label: string;
  designer: DesignerController;
  side: DesignSide;
  includeMessage: boolean;
  disabled: boolean;
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
          <CanvasEditor
            designer={designer}
            side={side}
            scale={width / 900}
            includeMessage={includeMessage}
            disabled={disabled || hidden}
          >
            {children}
          </CanvasEditor>
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
  designer: DesignerController;
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
  designer,
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
      <div className="canvas-toolbar no-print">
        <button
          type="button"
          className={`button ${designer.editing ? "button-primary" : "button-outline"}`}
          aria-pressed={designer.editing}
          disabled={disabled}
          onClick={() => designer.setEditing(!designer.editing)}
        >
          {designer.editing ? <Eye size={17} /> : <MousePointer2 size={17} />}
          {designer.editing ? "Finish editing" : "Edit design"}
        </button>
        <div className="history-actions">
          <button
            type="button"
            aria-label="Undo design change"
            title="Undo (⌘/Ctrl Z on canvas)"
            disabled={disabled || !designer.canUndo}
            onClick={designer.undo}
          >
            <Undo2 size={18} />
          </button>
          <button
            type="button"
            aria-label="Redo design change"
            title="Redo (⌘/Ctrl Shift Z on canvas)"
            disabled={disabled || !designer.canRedo}
            onClick={designer.redo}
          >
            <Redo2 size={18} />
          </button>
        </div>
        <span>
          {designer.editing
            ? "Select, move, resize. Make it yours."
            : designer.saved
              ? "Design saved on this device"
              : "Browser storage unavailable"}
        </span>
      </div>
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
          <ScaledCard
            hidden={view === "back"}
            label="01 / FRONT"
            designer={designer}
            side="front"
            includeMessage={includeMessage}
            disabled={disabled}
          >
            <VoucherFront
              ref={frontRef}
              data={data}
              includeMessage={includeMessage}
              design={designer.design}
            />
          </ScaledCard>
          <ScaledCard
            hidden={view === "front"}
            label="02 / BACK"
            designer={designer}
            side="back"
            includeMessage={includeMessage}
            disabled={disabled}
          >
            <VoucherBack ref={backRef} data={data} design={designer.design} />
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
