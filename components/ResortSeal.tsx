import { AssetImage } from "@/components/AssetImage";

export function ResortSeal({ src }: { src: string }) {
  if (!src) return null;
  return (
    <AssetImage
      src={src}
      alt="Upavan Resort official seal"
      className="resort-seal"
      fallback="none"
    />
  );
}
