"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  Copy,
  Eye,
  EyeOff,
  ImagePlus,
  Italic,
  Layers,
  LockKeyhole,
  MousePointer2,
  Square,
  Trash2,
  Type,
  UnlockKeyhole,
} from "lucide-react";
import { ASSETS } from "@/lib/defaults";
import type { DesignerController } from "@/lib/useDesigner";
import type { DesignElement, DesignSide } from "@/types/design";

function NumericField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled: boolean;
}) {
  return (
    <label className="design-number">
      <span>{label}</span>
      <input
        type="number"
        value={Math.round(value * 100) / 100}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => {
          const n = event.target.valueAsNumber;
          if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
      />
    </label>
  );
}

export function DesignInspector({
  designer,
  side,
  disabled,
  onSideChange,
}: {
  designer: DesignerController;
  side: DesignSide;
  disabled: boolean;
  onSideChange: (side: DesignSide) => void;
}) {
  const item = designer.selected?.side === side ? designer.selectedElement : null;
  const locked = disabled || !!item?.locked;
  function change(patch: Partial<DesignElement>) {
    if (item) designer.update(side, item.id, patch);
  }
  return (
    <div className="design-inspector">
      <section className="control-card inspector-card">
        <div className="control-heading">
          <span className="section-icon">
            <MousePointer2 size={19} />
          </span>
          <div>
            <h2>Edit your design</h2>
            <p>Click an element to make it yours.</p>
          </div>
        </div>
        <div className="inspector-body">
          <div className="design-side-picker" aria-label="Side to edit">
            {(["front", "back"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={side === value}
                disabled={disabled}
                onClick={() => {
                  designer.setSelected(null);
                  onSideChange(value);
                }}
              >
                {value === "front" ? "Front" : "Back"}
              </button>
            ))}
          </div>
          <div className="add-element-actions">
            <button type="button" disabled={disabled} onClick={() => designer.add(side, "text")}>
              <Type size={17} />
              Add text
            </button>
            <button type="button" disabled={disabled} onClick={() => designer.add(side, "image")}>
              <ImagePlus size={17} />
              Photo
            </button>
            <button type="button" disabled={disabled} onClick={() => designer.add(side, "shape")}>
              <Square size={17} />
              Shape
            </button>
          </div>
          <label className="color-field">
            <span>Card background</span>
            <input
              type="color"
              aria-label="Card background color"
              value={designer.design[`${side}Color`]}
              disabled={disabled}
              onChange={(event) => designer.setBackground(side, event.target.value)}
            />
          </label>
          {item ? (
            <div className="selected-properties">
              <div className="selected-heading">
                <h3>{item.label}</h3>
                <button
                  className="icon-button"
                  type="button"
                  aria-label={item.locked ? "Unlock element" : "Lock element"}
                  disabled={disabled}
                  onClick={() => change({ locked: !item.locked })}
                >
                  {item.locked ? <LockKeyhole size={17} /> : <UnlockKeyhole size={17} />}
                </button>
              </div>
              {item.kind === "text" && (
                <>
                  <label className="text-content-label" htmlFor="element-text">
                    Text content
                  </label>
                  <textarea
                    id="element-text"
                    value={item.text ?? ""}
                    disabled={locked}
                    maxLength={3000}
                    rows={4}
                    onChange={(event) => change({ text: event.target.value })}
                  />
                  <p className="inspector-hint">
                    Use {"{{coupleName}}"} and {"{{sponsorName}}"} to keep names linked.
                  </p>
                  <label className="font-picker">
                    <span>Typeface</span>
                    <select
                      aria-label="Typeface"
                      value={item.fontFamily ?? "sans"}
                      disabled={locked}
                      onChange={(event) =>
                        change({ fontFamily: event.target.value as "serif" | "sans" })
                      }
                    >
                      <option value="serif">Cormorant Garamond</option>
                      <option value="sans">Inter</option>
                    </select>
                  </label>
                  <div className="text-style-row">
                    <NumericField
                      label="Font size"
                      min={6}
                      max={160}
                      value={item.fontSize ?? 16}
                      onChange={(fontSize) => change({ fontSize })}
                      disabled={locked}
                    />
                    <button
                      className="style-button"
                      type="button"
                      aria-label="Bold text"
                      aria-pressed={(item.fontWeight ?? 400) >= 600}
                      disabled={locked}
                      onClick={() =>
                        change({ fontWeight: (item.fontWeight ?? 400) >= 600 ? 400 : 600 })
                      }
                    >
                      <Bold size={17} />
                    </button>
                    <button
                      className="style-button"
                      type="button"
                      aria-label="Italic text"
                      aria-pressed={!!item.italic}
                      disabled={locked}
                      onClick={() => change({ italic: !item.italic })}
                    >
                      <Italic size={17} />
                    </button>
                  </div>
                  <div className="text-align-actions">
                    {(
                      [
                        { value: "left", Icon: AlignLeft },
                        { value: "center", Icon: AlignCenter },
                        { value: "right", Icon: AlignRight },
                      ] as const
                    ).map(({ value, Icon }) => (
                      <button
                        type="button"
                        key={value}
                        aria-label={`Align text ${value}`}
                        aria-pressed={(item.align ?? "left") === value}
                        disabled={locked}
                        onClick={() => change({ align: value })}
                      >
                        <Icon size={17} />
                      </button>
                    ))}
                  </div>
                  <p className="inspector-hint">
                    Text fits its box automatically. Enlarge the box to use a larger font.
                  </p>
                </>
              )}
              {item.kind === "image" && (
                <>
                  <label className="font-picker">
                    <span>Image source</span>
                    <select
                      aria-label="Image source"
                      value={item.asset ?? "mainRoomImage"}
                      disabled={locked}
                      onChange={(event) =>
                        change({ asset: event.target.value as DesignElement["asset"] })
                      }
                    >
                      {ASSETS.map(({ key, label }) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="button button-outline inspector-replace"
                    type="button"
                    disabled={locked}
                    onClick={() =>
                      document.getElementById(`asset-${item.asset ?? "mainRoomImage"}`)?.click()
                    }
                  >
                    <ImagePlus size={16} />
                    Replace image
                  </button>
                  {item.asset !== "logo" && item.asset !== "seal" && (
                    <div className="focal-controls">
                      <label>
                        Photo position · horizontal
                        <input
                          aria-label="Photo horizontal position"
                          type="range"
                          min={0}
                          max={100}
                          value={item.focalX ?? 50}
                          disabled={locked}
                          onChange={(event) => change({ focalX: Number(event.target.value) })}
                        />
                      </label>
                      <label>
                        Photo position · vertical
                        <input
                          aria-label="Photo vertical position"
                          type="range"
                          min={0}
                          max={100}
                          value={item.focalY ?? 50}
                          disabled={locked}
                          onChange={(event) => change({ focalY: Number(event.target.value) })}
                        />
                      </label>
                      <NumericField
                        label="Corner radius"
                        value={item.radius ?? 0}
                        min={0}
                        max={220}
                        disabled={locked}
                        onChange={(radius) => change({ radius, arch: false })}
                      />
                    </div>
                  )}
                </>
              )}
              {item.kind !== "image" && (
                <label className="color-field">
                  <span>{item.kind === "text" ? "Text color" : "Fill color"}</span>
                  <input
                    type="color"
                    aria-label="Element color"
                    value={item.color === "transparent" ? "#ffffff" : (item.color ?? "#063d2b")}
                    disabled={locked}
                    onChange={(event) => change({ color: event.target.value })}
                  />
                </label>
              )}
              <div className="geometry-fields">
                <NumericField
                  label="X position"
                  min={0}
                  max={900 - item.width}
                  value={item.x}
                  disabled={locked}
                  onChange={(x) => change({ x })}
                />
                <NumericField
                  label="Y position"
                  min={0}
                  max={600 - item.height}
                  value={item.y}
                  disabled={locked}
                  onChange={(y) => change({ y })}
                />
                <NumericField
                  label="Width"
                  min={12}
                  max={900 - Math.max(0, item.x)}
                  value={item.width}
                  disabled={locked}
                  onChange={(width) => change({ width })}
                />
                <NumericField
                  label="Height"
                  min={12}
                  max={600 - Math.max(0, item.y)}
                  value={item.height}
                  disabled={locked}
                  onChange={(height) => change({ height })}
                />
                <NumericField
                  label="Rotation"
                  min={-180}
                  max={180}
                  value={item.rotation}
                  disabled={locked}
                  onChange={(rotation) => change({ rotation })}
                />
                <NumericField
                  label="Opacity (%)"
                  min={0}
                  max={100}
                  value={item.opacity * 100}
                  disabled={locked}
                  onChange={(opacity) => change({ opacity: opacity / 100 })}
                />
              </div>
              <div className="layer-actions">
                <button
                  type="button"
                  title="Bring forward"
                  aria-label="Bring forward"
                  disabled={locked}
                  onClick={() => designer.reorder("up")}
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  type="button"
                  title="Send backward"
                  aria-label="Send backward"
                  disabled={locked}
                  onClick={() => designer.reorder("down")}
                >
                  <ArrowDown size={17} />
                </button>
                <button
                  type="button"
                  title="Duplicate element"
                  aria-label="Duplicate element"
                  disabled={locked}
                  onClick={designer.duplicate}
                >
                  <Copy size={17} />
                </button>
                <button
                  type="button"
                  title="Delete element"
                  aria-label="Delete element"
                  disabled={locked}
                  onClick={designer.remove}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ) : (
            <div className="inspector-empty">
              <MousePointer2 size={28} strokeWidth={1.2} />
              <p>Select text, a photo, or a shape on the voucher, or choose a layer below.</p>
              <span>
                Drag to move · corner handle to resize
                <br />
                Arrow keys to nudge · Shift for bigger steps
              </span>
            </div>
          )}
        </div>
      </section>
      <section className="control-card layer-card">
        <h3>
          <Layers size={17} />
          Layers<span>{designer.design[side].length}</span>
        </h3>
        <div className="layer-list">
          {[...designer.design[side]].reverse().map((layer) => (
            <div key={layer.id} className={`layer-row ${item?.id === layer.id ? "active" : ""}`}>
              <button
                type="button"
                className="layer-select"
                aria-label={`Select ${layer.label}`}
                aria-pressed={item?.id === layer.id}
                disabled={disabled}
                onClick={() => designer.setSelected({ side, id: layer.id })}
              >
                {layer.kind === "text" ? (
                  <Type size={15} />
                ) : layer.kind === "image" ? (
                  <ImagePlus size={15} />
                ) : (
                  <Square size={15} />
                )}
                <span>{layer.label}</span>
                {layer.locked && <LockKeyhole size={12} />}
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label={`${layer.hidden ? "Show" : "Hide"} ${layer.label}`}
                disabled={disabled}
                onClick={() => designer.update(side, layer.id, { hidden: !layer.hidden })}
              >
                {layer.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
