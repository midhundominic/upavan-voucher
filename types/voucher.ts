export interface VoucherData {
  coupleName: string;
  sponsorName: string;
  logo: string;
  seal: string;
  mainRoomImage: string;
  heroImage: string;
  galleryImage1: string;
  galleryImage2: string;
  galleryImage3: string;
}

export type AssetKey = Exclude<keyof VoucherData, "coupleName" | "sponsorName">;
export type VoucherView = "front" | "back" | "both";
export type ExportAction = "front" | "back" | "pdf" | "print";

export interface AssetDefinition {
  key: AssetKey;
  label: string;
  description: string;
  filename: string;
  fit: "cover" | "contain";
}
