export type TemplateId = "classic" | "forest" | "editorial";
export type DesignSide = "front" | "back";
export type ElementKind = "text" | "image" | "shape" | "botanical";
export type FontChoice = "serif" | "sans";

export interface DesignElement {
  id: string;
  label: string;
  kind: ElementKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  hidden: boolean;
  text?: string;
  fontSize?: number;
  fontFamily?: FontChoice;
  fontWeight?: number;
  italic?: boolean;
  align?: "left" | "center" | "right";
  color?: string;
  lineHeight?: number;
  letterSpacing?: number;
  asset?: import("@/types/voucher").AssetKey;
  focalX?: number;
  focalY?: number;
  radius?: number;
  arch?: boolean;
  stroke?: string;
  strokeWidth?: number;
  icon?: "bed" | "pin" | "phone" | "globe" | "trees" | "food" | "mountain";
  visibility?: "always" | "with-message" | "without-message";
}

export interface VoucherDesign {
  front: DesignElement[];
  back: DesignElement[];
  frontColor: string;
  backColor: string;
}

export interface DesignWorkspace {
  template: TemplateId;
  drafts: Record<TemplateId, VoucherDesign>;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  color: string;
}

export interface ElementSelection {
  side: DesignSide;
  id: string;
}
