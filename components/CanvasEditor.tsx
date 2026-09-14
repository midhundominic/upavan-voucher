"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { displayedElement, visibleElement } from "@/lib/templates";
import type { DesignerController } from "@/lib/useDesigner";
import type { DesignElement, DesignSide } from "@/types/design";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function CanvasEditor({
  children,
  designer,
  side,
  scale,
  includeMessage,
  disabled,
}: {
  children: ReactNode;
  designer: DesignerController;
  side: DesignSide;
  scale: number;
  includeMessage: boolean;
  disabled: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    item: DesignElement;
    mode: "move" | "resize";
    x: number;
    y: number;
  } | null>(null);
  const [guides, setGuides] = useState({ x: false, y: false });
  const editing = designer.editing && !disabled;
  const original = designer.selected?.side === side ? designer.selectedElement : null;
  const selected =
    original && visibleElement(original, includeMessage)
      ? displayedElement(original, side, includeMessage)
      : null;

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!editing || event.button !== 0) return;
    const target = event.target as HTMLElement;
    const id =
      target.closest<HTMLElement>("[data-element-id]")?.dataset.elementId ||
      target.closest<HTMLElement>("[data-selection-id]")?.dataset.selectionId;
    const item = designer.design[side].find((item) => item.id === id);
    if (!item || item.locked) {
      designer.setSelected(null);
      return;
    }
    event.preventDefault();
    designer.setSelected({ side, id: item.id });
    root.current?.focus({ preventScroll: true });
    gesture.current = {
      item: { ...item },
      mode: target.closest("[data-resize]") ? "resize" : "move",
      x: event.clientX,
      y: event.clientY,
    };
    designer.startGesture();
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start) return;
    const dx = (event.clientX - start.x) / scale;
    const dy = (event.clientY - start.y) / scale;
    const displayed = displayedElement(start.item, side, includeMessage);
    if (start.mode === "resize") {
      const radians = (start.item.rotation * Math.PI) / 180;
      const localX = dx * Math.cos(radians) + dy * Math.sin(radians);
      const localY = -dx * Math.sin(radians) + dy * Math.cos(radians);
      let width = clamp(start.item.width + localX, 20, Math.max(20, 900 - displayed.x));
      let height = clamp(start.item.height + localY, 12, Math.max(12, 600 - displayed.y));
      if (event.shiftKey || start.item.asset === "logo" || start.item.asset === "seal") {
        const ratio = start.item.width / start.item.height;
        height = width / ratio;
        if (height > 600 - displayed.y) {
          height = 600 - displayed.y;
          width = height * ratio;
        }
      }
      designer.update(
        side,
        start.item.id,
        { width: Math.round(width), height: Math.round(height) },
        true,
      );
    } else {
      let x = clamp(displayed.x + dx, 0, Math.max(0, 900 - displayed.width));
      let y = clamp(displayed.y + dy, 0, Math.max(0, 600 - displayed.height));
      const snapX = Math.abs(x + displayed.width / 2 - 450) < 6;
      const snapY = Math.abs(y + displayed.height / 2 - 300) < 6;
      if (!event.altKey) {
        if (snapX) x = 450 - displayed.width / 2;
        if (snapY) y = 300 - displayed.height / 2;
      }
      setGuides({ x: snapX && !event.altKey, y: snapY && !event.altKey });
      designer.update(
        side,
        start.item.id,
        {
          x: Math.round(start.item.x + x - displayed.x),
          y: Math.round(start.item.y + y - displayed.y),
        },
        true,
      );
    }
  }
  function finish(cancel = false) {
    if (!gesture.current) return;
    gesture.current = null;
    designer.finishGesture(cancel);
    setGuides({ x: false, y: false });
  }
  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!editing) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) designer.redo();
      else designer.undo();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
      event.preventDefault();
      designer.redo();
      return;
    }
    if (event.key === "Escape") {
      finish(true);
      designer.setSelected(null);
      return;
    }
    if (!original || original.locked) return;
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      designer.remove();
      return;
    }
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const step = steps[event.key];
    if (step) {
      event.preventDefault();
      const n = event.shiftKey ? 10 : 1;
      designer.update(side, original.id, {
        x: clamp(original.x + step[0] * n, 0, 900 - original.width),
        y: clamp(original.y + step[1] * n, 0, 600 - original.height),
      });
    }
    if (event.key === "Enter" && original.kind === "text") {
      event.preventDefault();
      document.getElementById("element-text")?.focus();
    }
  }
  return (
    <div
      ref={root}
      className={`canvas-editor ${editing ? "is-editing" : ""}`}
      role={editing ? "group" : undefined}
      tabIndex={editing ? 0 : undefined}
      aria-label={
        editing
          ? `${side} design canvas. Select an element, then use arrow keys to move or Enter to edit text.`
          : undefined
      }
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={() => finish()}
      onPointerCancel={() => finish(true)}
      onLostPointerCapture={() => finish()}
      onKeyDown={keyDown}
      onDoubleClick={() => {
        if (editing && selected?.kind === "text") document.getElementById("element-text")?.focus();
      }}
    >
      {children}
      {editing && selected && !selected.locked && (
        <div
          className="canvas-selection no-print"
          data-selection-id={selected.id}
          style={
            {
              left: selected.x,
              top: selected.y,
              width: selected.width,
              height: selected.height,
              transform: `rotate(${selected.rotation}deg)`,
              "--canvas-inverse-scale": 1 / scale,
            } as React.CSSProperties
          }
        >
          <span className="selection-caption">{selected.label}</span>
          <span className="selection-dot dot-tl" />
          <span className="selection-dot dot-tr" />
          <span className="selection-dot dot-bl" />
          <button
            type="button"
            className="resize-handle"
            data-resize="true"
            aria-label={`Resize ${selected.label}`}
            onKeyDown={(event) => {
              if (event.key.startsWith("Arrow")) {
                event.preventDefault();
                event.stopPropagation();
                const increment = event.shiftKey ? 10 : 1;
                designer.update(side, selected.id, {
                  width: clamp(
                    original!.width +
                      (event.key === "ArrowRight"
                        ? increment
                        : event.key === "ArrowLeft"
                          ? -increment
                          : 0),
                    20,
                    900,
                  ),
                  height: clamp(
                    original!.height +
                      (event.key === "ArrowDown"
                        ? increment
                        : event.key === "ArrowUp"
                          ? -increment
                          : 0),
                    12,
                    600,
                  ),
                });
              }
            }}
          />
        </div>
      )}
      {editing && guides.x && <div className="canvas-guide guide-x no-print" />}
      {editing && guides.y && <div className="canvas-guide guide-y no-print" />}
    </div>
  );
}
