import "server-only";
import { access } from "node:fs/promises";
import path from "node:path";
import { ASSETS, DEFAULT_VOUCHER } from "@/lib/defaults";

// Check files on each authenticated page load, including after local replacements.
export async function getDefaultVoucher() {
  const data = { ...DEFAULT_VOUCHER };
  await Promise.all(
    ASSETS.map(async ({ key, filename }) => {
      try {
        await access(path.join(process.cwd(), "public", "assets", filename));
      } catch {
        data[key] = "";
      }
    }),
  );
  return data;
}
