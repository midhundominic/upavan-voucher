import { forwardRef } from "react";
import { VoucherArtwork } from "@/components/VoucherArtwork";
import type { VoucherData } from "@/types/voucher";
import type { VoucherDesign } from "@/types/design";

export const VoucherFront = forwardRef<
  HTMLElement,
  { data: VoucherData; design: VoucherDesign; includeMessage: boolean }
>(function VoucherFront(props, ref) {
  return <VoucherArtwork ref={ref} {...props} side="front" />;
});
