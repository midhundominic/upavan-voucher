import type { AssetDefinition, VoucherData } from "@/types/voucher";

export const DEFAULT_VOUCHER: VoucherData = {
  coupleName: "Anupama and Soorya Prakash",
  sponsorName: "Murali and Rajeni",
  logo: "/assets/upavan-logo.png",
  seal: "/assets/upavan-seal.png",
  mainRoomImage: "/assets/room-main.jpg",
  heroImage: "/assets/resort-pool.jpg",
  galleryImage1: "/assets/room-2.jpg",
  galleryImage2: "/assets/restaurant.jpg",
  galleryImage3: "/assets/view.jpg",
};

export const ASSETS: AssetDefinition[] = [
  {
    key: "logo",
    label: "Resort Logo",
    description: "Front & back",
    filename: "upavan-logo.png",
    fit: "contain",
  },
  {
    key: "seal",
    label: "Resort Seal",
    description: "Your finishing touch",
    filename: "upavan-seal.png",
    fit: "contain",
  },
  {
    key: "mainRoomImage",
    label: "Main Room Image",
    description: "Front · featured photograph",
    filename: "room-main.jpg",
    fit: "cover",
  },
  {
    key: "heroImage",
    label: "Resort Image",
    description: "Back · hero photograph",
    filename: "resort-pool.jpg",
    fit: "cover",
  },
  {
    key: "galleryImage1",
    label: "Gallery Image 1",
    description: "Room",
    filename: "room-2.jpg",
    fit: "cover",
  },
  {
    key: "galleryImage2",
    label: "Gallery Image 2",
    description: "Restaurant / resort",
    filename: "restaurant.jpg",
    fit: "cover",
  },
  {
    key: "galleryImage3",
    label: "Gallery Image 3",
    description: "Balcony / Wayanad view",
    filename: "view.jpg",
    fit: "cover",
  },
];

export const MAX_NAME_LENGTH = 80;
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 40_000_000;

export function punctuateName(name: string) {
  const value = name.trim();
  return value ? `${value.replace(/[.。]+$/u, "")}.` : "";
}
