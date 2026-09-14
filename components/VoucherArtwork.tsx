"use client";

import { forwardRef, useLayoutEffect, useRef, type CSSProperties } from "react";
import { BedDouble, MapPin, Phone, Globe, Trees, UtensilsCrossed, Mountain } from "lucide-react";
import { AssetImage } from "@/components/AssetImage";
import { ResortLogo } from "@/components/ResortLogo";
import { Botanical } from "@/components/Botanical";
import { displayedElement, resolveText, visibleElement } from "@/lib/templates";
import type { DesignElement, DesignSide, VoucherDesign } from "@/types/design";
import type { VoucherData } from "@/types/voucher";

const icons = {
  bed: BedDouble,
  pin: MapPin,
  phone: Phone,
  globe: Globe,
  trees: Trees,
  food: UtensilsCrossed,
  mountain: Mountain,
};
function ArtworkText({ item, data }: { item: DesignElement; data: VoucherData }) {
  const textRef = useRef<HTMLDivElement>(null);
  const text = resolveText(item.text ?? "", data);
  useLayoutEffect(() => {
    let active = true;
    function fit() {
      const node = textRef.current;
      if (!node || !active) return;
      let size = item.fontSize ?? 16;
      node.style.fontSize = `${size}px`;
      while (
        (node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1) &&
        size > 6
      ) {
        size -= 0.5;
        node.style.fontSize = `${size}px`;
      }
    }
    fit();
    void document.fonts.ready.then(fit);
    return () => {
      active = false;
    };
  }, [
    text,
    item.fontSize,
    item.width,
    item.height,
    item.fontFamily,
    item.fontWeight,
    item.lineHeight,
    item.italic,
    item.letterSpacing,
    item.icon,
  ]);
  const Icon = item.icon ? icons[item.icon] : null;
  return (
    <div className="artwork-text-row">
      {Icon && <Icon className="artwork-icon" aria-hidden="true" strokeWidth={1.3} />}
      <div ref={textRef} className="artwork-text" style={{ fontSize: item.fontSize ?? 16 }}>
        {text}
      </div>
    </div>
  );
}
export const VoucherArtwork = forwardRef<
  HTMLElement,
  { design: VoucherDesign; side: DesignSide; data: VoucherData; includeMessage: boolean }
>(function VoucherArtwork({ design, side, data, includeMessage }, ref) {
  return (
    <article
      ref={ref}
      className={`voucher-card voucher-${side} artwork-card`}
      aria-label={`${side === "front" ? "Front" : "Back"} of complimentary stay voucher`}
      style={{ backgroundColor: design[`${side}Color`] }}
    >
      {design[side]
        .filter((item) => visibleElement(item, includeMessage))
        .map((original) => {
          const item = displayedElement(original, side, includeMessage);
          const isBrand = item.asset === "logo" || item.asset === "seal";
          if (item.kind === "image" && item.asset === "seal" && !data.seal) return null;
          const style: CSSProperties = {
            position: "absolute",
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            transform: `rotate(${item.rotation}deg)`,
            opacity: item.opacity,
            color: item.color,
            fontFamily:
              item.fontFamily === "serif"
                ? "var(--font-serif), Georgia, serif"
                : "var(--font-sans), Arial, sans-serif",
            fontWeight: item.fontWeight ?? 400,
            fontStyle: item.italic ? "italic" : "normal",
            textAlign: item.align ?? "left",
            lineHeight: item.lineHeight ?? 1.16,
            letterSpacing: item.letterSpacing ?? 0,
            borderRadius: item.arch ? "180px 0 0 108px" : (item.radius ?? 0),
            backgroundColor:
              item.kind === "shape" || (item.kind === "image" && isBrand) ? item.color : undefined,
            border: item.stroke ? `${item.strokeWidth ?? 1}px solid ${item.stroke}` : undefined,
          };
          return (
            <div
              key={item.id}
              className={`design-layer layer-${item.kind}`}
              data-element-id={item.id}
              data-locked={item.locked}
              style={style}
            >
              {item.kind === "text" && <ArtworkText item={item} data={data} />}
              {item.kind === "image" &&
                (item.asset === "logo" ? (
                  <ResortLogo src={data.logo} />
                ) : (
                  <AssetImage
                    src={item.asset ? data[item.asset] : ""}
                    alt={item.asset === "seal" ? "Upavan Resort official seal" : item.label}
                    fallback={item.asset === "seal" ? "none" : "photo"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: isBrand ? "contain" : "cover",
                      objectPosition: `${item.focalX ?? 50}% ${item.focalY ?? 50}%`,
                    }}
                  />
                ))}
              {item.kind === "botanical" && <Botanical />}
            </div>
          );
        })}
    </article>
  );
});
