import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <main className="fallback-page">
      <Leaf size={32} strokeWidth={1.3} />
      <h1>A little off the beaten path.</h1>
      <p>This page doesn’t exist. Your voucher designer is just here.</p>
      <Link className="button button-primary" href="/">
        Back to the designer
      </Link>
    </main>
  );
}
