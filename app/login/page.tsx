import { redirect } from "next/navigation";
import { getSession, isAuthConfigured } from "@/lib/auth";
import { getDefaultVoucher } from "@/lib/assets.server";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function Login() {
  if (await getSession()) redirect("/");
  const defaults = await getDefaultVoucher();
  return (
    <LoginForm
      configured={isAuthConfigured()}
      logo={defaults.logo}
      hero="/assets/resort-property.jpg"
    />
  );
}
