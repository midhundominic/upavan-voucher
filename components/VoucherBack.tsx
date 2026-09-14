import { forwardRef } from "react";
import { VoucherArtwork } from "@/components/VoucherArtwork";
import type { VoucherData } from "@/types/voucher";
import type { VoucherDesign } from "@/types/design";

export const VoucherBack = forwardRef<HTMLElement, { data: VoucherData; design: VoucherDesign }>(
  function VoucherBack(props, ref) {
    return <VoucherArtwork ref={ref} {...props} includeMessage={false} side="back" />;
  },
);
