import type { DesignElement, DesignWorkspace } from "@/types/design";
import { createWorkspace } from "@/lib/templates";
import { ASSETS } from "@/lib/defaults";

export const DESIGN_STORAGE_KEY = "upavan-design:v1";
const ids = ["classic", "forest", "editorial"] as const;
function validElement(value: unknown): value is DesignElement {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  if (
    typeof e.id !== "string" ||
    !/^[a-zA-Z0-9-]{1,100}$/.test(e.id) ||
    typeof e.label !== "string" ||
    e.label.length > 100
  )
    return false;
  if (!["text", "image", "shape", "botanical"].includes(String(e.kind))) return false;
  for (const key of ["x", "y", "width", "height", "rotation", "opacity"])
    if (typeof e[key] !== "number" || !Number.isFinite(e[key]) || Math.abs(e[key] as number) > 2000)
      return false;
  if (
    (e.width as number) <= 0 ||
    (e.height as number) <= 0 ||
    (e.opacity as number) < 0 ||
    (e.opacity as number) > 1
  )
    return false;
  if (typeof e.hidden !== "boolean" || typeof e.locked !== "boolean") return false;
  for (const key of ["italic", "arch"])
    if (e[key] !== undefined && typeof e[key] !== "boolean") return false;
  if (e.text !== undefined && (typeof e.text !== "string" || e.text.length > 3000)) return false;
  if (e.asset !== undefined && !ASSETS.some(({ key }) => key === e.asset)) return false;
  for (const [key, choices] of Object.entries({
    fontFamily: ["serif", "sans"],
    align: ["left", "center", "right"],
    icon: ["bed", "pin", "phone", "globe", "trees", "food", "mountain"],
    visibility: ["always", "with-message", "without-message"],
  }))
    if (e[key] !== undefined && !choices.includes(String(e[key]))) return false;
  for (const key of [
    "fontSize",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "focalX",
    "focalY",
    "radius",
    "strokeWidth",
  ])
    if (
      e[key] !== undefined &&
      (typeof e[key] !== "number" || !Number.isFinite(e[key]) || Math.abs(e[key] as number) > 2000)
    )
      return false;
  for (const key of ["color", "stroke"])
    if (
      e[key] !== undefined &&
      (typeof e[key] !== "string" || !/^(#[\da-f]{6}|transparent)$/i.test(e[key] as string))
    )
      return false;
  return true;
}

export function loadDesign(): DesignWorkspace {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(DESIGN_STORAGE_KEY) || "null");
    if (!stored || typeof stored !== "object") return createWorkspace();
    const value = stored as DesignWorkspace;
    if (!ids.includes(value.template) || !value.drafts) return createWorkspace();
    for (const id of ids) {
      const draft = value.drafts[id];
      if (
        !draft ||
        !/^#[\da-f]{6}$/i.test(draft.frontColor) ||
        !/^#[\da-f]{6}$/i.test(draft.backColor)
      )
        return createWorkspace();
      for (const side of ["front", "back"] as const) {
        if (
          !Array.isArray(draft[side]) ||
          draft[side].length > 100 ||
          !draft[side].every(validElement)
        )
          return createWorkspace();
        if (new Set(draft[side].map(({ id }) => id)).size !== draft[side].length)
          return createWorkspace();
      }
    }
    return value;
  } catch {
    return createWorkspace();
  }
}
export function saveDesign(workspace: DesignWorkspace) {
  try {
    localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(workspace));
    return true;
  } catch {
    return false;
  }
}
