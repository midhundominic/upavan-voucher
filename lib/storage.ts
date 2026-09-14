import { DEFAULT_VOUCHER, MAX_NAME_LENGTH } from "@/lib/defaults";

export const STORAGE_KEY = "upavan-voucher:v1";
export type SavedNames = Pick<typeof DEFAULT_VOUCHER, "coupleName" | "sponsorName">;

export function loadNames(): SavedNames {
  const fallback = {
    coupleName: DEFAULT_VOUCHER.coupleName,
    sponsorName: DEFAULT_VOUCHER.sponsorName,
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return fallback;
    const values = saved as Record<string, unknown>;
    return {
      coupleName:
        typeof values.coupleName === "string"
          ? values.coupleName.slice(0, MAX_NAME_LENGTH)
          : fallback.coupleName,
      sponsorName:
        typeof values.sponsorName === "string"
          ? values.sponsorName.slice(0, MAX_NAME_LENGTH)
          : fallback.sponsorName,
    };
  } catch {
    return fallback;
  }
}

export function saveNames(names: SavedNames): boolean {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ coupleName: names.coupleName, sponsorName: names.sponsorName }),
    );
    return true;
  } catch {
    return false;
  }
}
