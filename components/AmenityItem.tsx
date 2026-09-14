import type { LucideIcon } from "lucide-react";

export function AmenityItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="amenity-item">
      <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
