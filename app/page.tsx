import { requireSession } from "@/lib/auth";
import { getDefaultVoucher } from "@/lib/assets.server";
import { VoucherEditor } from "@/components/VoucherEditor";

export const dynamic = "force-dynamic";

export default async function Home() {
  await requireSession();
  const defaults = await getDefaultVoucher();
  return <VoucherEditor defaults={defaults} />;
}
