import type {
  DesignElement,
  TemplateDefinition,
  VoucherDesign,
  DesignWorkspace,
} from "@/types/design";
import type { VoucherData } from "@/types/voucher";
import { punctuateName } from "@/lib/defaults";

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "classic",
    name: "Classic Garden",
    description: "Soft curves & warm ivory",
    color: "#f8f4e9",
  },
  {
    id: "forest",
    name: "Forest Retreat",
    description: "Deep green & bold photography",
    color: "#063d2b",
  },
  {
    id: "editorial",
    name: "Ivory Editorial",
    description: "Quiet luxury & clean lines",
    color: "#ece5d3",
  },
];

function element(
  id: string,
  label: string,
  kind: DesignElement["kind"],
  x: number,
  y: number,
  width: number,
  height: number,
  extra: Partial<DesignElement> = {},
): DesignElement {
  return {
    id,
    label,
    kind,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    ...extra,
  };
}
function text(
  id: string,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  height: number,
  size = 16,
  extra: Partial<DesignElement> = {},
) {
  return element(id, label, "text", x, y, width, height, {
    text: value,
    fontSize: size,
    fontFamily: "sans",
    fontWeight: 400,
    color: "#063d2b",
    lineHeight: 1.16,
    align: "left",
    ...extra,
  });
}
const border = () =>
  element("border", "Fine gold border", "shape", 16, 16, 868, 568, {
    color: "transparent",
    stroke: "#b99549",
    strokeWidth: 1,
    radius: 6,
    locked: true,
    opacity: 0.65,
  });

function classic(): VoucherDesign {
  return {
    frontColor: "#fcf9f0",
    backColor: "#fffdf8",
    front: [
      element("room", "Main room photograph", "image", 488, 0, 412, 480, {
        asset: "mainRoomImage",
        arch: true,
        focalX: 42,
        focalY: 50,
      }),
      element("footer", "Regards background", "shape", 0, 480, 900, 120, {
        color: "#f2eddd",
        locked: true,
      }),
      element("leaf-top", "Botanical corner", "botanical", -30, -15, 140, 185, {
        color: "#6a7e55",
        rotation: 110,
        opacity: 0.6,
        locked: true,
      }),
      element("leaf-bottom", "Botanical signature", "botanical", 777, 470, 140, 165, {
        color: "#788657",
        rotation: -40,
        opacity: 0.5,
        locked: true,
      }),
      element("logo", "Resort logo", "image", 56, 36, 162, 69, { asset: "logo" }),
      text("tagline", "Resort tagline", "NATURE RESTS HERE WITH YOU", 56, 120, 390, 18, 10, {
        letterSpacing: 2,
        color: "#62705a",
      }),
      element("rule", "Gold accent line", "shape", 56, 155, 46, 1, {
        color: "#b99549",
        locked: true,
      }),
      text("title", "Main heading", "Complimentary", 56, 172, 435, 72, 61, {
        fontFamily: "serif",
        fontWeight: 500,
        letterSpacing: -1.2,
      }),
      text("subtitle", "Voucher heading", "Stay Voucher", 56, 235, 415, 68, 60, {
        fontFamily: "serif",
        fontWeight: 500,
        color: "#a78842",
        letterSpacing: -1,
      }),
      text("duration", "Stay duration", "1 Day  •  1 Night", 56, 309, 365, 28, 18, { icon: "bed" }),
      element("guest-panel", "Guest name background", "shape", 56, 351, 417, 80, {
        color: "#eee6cf",
        radius: 6,
        locked: true,
      }),
      text("guest-label", "Guest introduction", "Especially for", 73, 360, 370, 15, 10, {
        color: "#77643c",
      }),
      text("couple", "Couple name", "{{coupleName}}", 73, 378, 384, 46, 33, {
        fontFamily: "serif",
        fontWeight: 600,
      }),
      text("location", "Destination", "Wayanad, Kerala", 56, 443, 410, 19, 12, {
        icon: "pin",
        color: "#536b49",
      }),
      text(
        "condition",
        "Stay condition",
        "Weekday Stay | Not valid on Saturdays & Sundays",
        56,
        465,
        425,
        13,
        9,
        { color: "#626c50" },
      ),
      text(
        "photo-note",
        "Photograph caption",
        "MORE THAN A STAY\nA feeling.",
        598,
        377,
        252,
        73,
        32,
        { fontFamily: "serif", italic: true, align: "right", color: "#fffdf8" },
      ),
      text(
        "memory",
        "Gift sentiment",
        "A little time away. A beautiful memory together.",
        54,
        496,
        624,
        17,
        11,
        { color: "#726741", visibility: "without-message" },
      ),
      text(
        "regards",
        "Regards introduction",
        "With warm regards and best wishes,",
        54,
        520,
        635,
        18,
        12,
        { color: "#626d50" },
      ),
      text("sponsor", "Sponsor name", "{{sponsorName}}", 54, 542, 625, 40, 34, {
        fontFamily: "serif",
        fontWeight: 600,
      }),
      element("seal", "Original resort seal", "image", 714, 489, 132, 93, { asset: "seal" }),
      text(
        "invitation",
        "Original invitation",
        "Dear {{coupleName}},\nWe invite you to stay at Upavan Resort, Wayanad for a day and a night at your convenience, except on Saturdays and Sundays. Please let us know the date of your convenience.",
        54,
        448,
        630,
        72,
        12,
        { color: "#536344", lineHeight: 1.35, visibility: "with-message" },
      ),
      border(),
    ],
    back: [
      element("hero", "Resort hero photograph", "image", 0, 0, 900, 267, {
        asset: "heroImage",
        focalX: 50,
        focalY: 55,
      }),
      element("hero-tint", "Photograph shade", "shape", 480, 0, 420, 267, {
        color: "#063d2b",
        opacity: 0.35,
        locked: true,
      }),
      text("hero-overline", "Experience introduction", "EXPERIENCE", 488, 58, 362, 22, 15, {
        color: "#fffdf8",
        letterSpacing: 6,
        align: "right",
      }),
      text("hero-heading", "Experience heading", "WAYANAD", 423, 89, 431, 87, 69, {
        color: "#fffdf8",
        fontFamily: "serif",
        align: "right",
      }),
      text("hero-subline", "Experience closing", "DIFFERENTLY", 493, 179, 357, 21, 15, {
        color: "#fffdf8",
        letterSpacing: 5,
        align: "right",
      }),
      text(
        "destination",
        "Destination caption",
        "A QUIETER KIND OF ESCAPE\nWAYANAD, KERALA",
        43,
        213,
        330,
        37,
        11,
        { color: "#fffdf8", lineHeight: 1.6, letterSpacing: 1 },
      ),
      text("experience", "Experience line", "STAY  •  UNWIND  •  RECONNECT", 43, 284, 814, 22, 14, {
        color: "#5c7253",
        align: "center",
        letterSpacing: 3,
      }),
      ...["galleryImage1", "galleryImage2", "galleryImage3"].map((asset, index) =>
        element(
          `gallery-${index}`,
          ["Room photograph", "Restaurant photograph", "Wayanad photograph"][index],
          "image",
          43 + index * 276,
          319,
          262,
          112,
          { asset: asset as DesignElement["asset"], radius: 5, focalX: 50, focalY: 50 },
        ),
      ),
      ...["Comfortable Stays", "Delicious Cuisine", "Nature Experiences", "Breathtaking Views"].map(
        (label, index) =>
          text(`amenity-${index}`, label, label, 45 + index * 204, 449, 195, 27, 11, {
            color: "#5c714f",
            icon: ["bed", "food", "trees", "mountain"][index] as DesignElement["icon"],
          }),
      ),
      element("footer-rule", "Footer divider", "shape", 43, 490, 814, 1, {
        color: "#dedbc9",
        locked: true,
      }),
      element("logo", "Resort logo", "image", 43, 511, 128, 60, { asset: "logo" }),
      text(
        "address",
        "Resort address",
        "Lakkidi P.O., Wayanad, Kerala - 673576",
        201,
        512,
        415,
        17,
        11,
        { color: "#5f704e", icon: "pin" },
      ),
      text("phone", "Resort telephone", "04936 255 272", 201, 536, 400, 17, 11, {
        color: "#5f704e",
        icon: "phone",
      }),
      text("website", "Resort website", "www.upavanresort.com", 201, 560, 400, 17, 11, {
        color: "#5f704e",
        icon: "globe",
      }),
      text("nature", "Brand promise", "WHERE\nNATURE", 719, 506, 150, 60, 26, {
        fontFamily: "serif",
        color: "#5e704e",
        letterSpacing: 1.5,
        lineHeight: 0.9,
      }),
      text("nature-footer", "Brand promise closing", "FEELS LIKE HOME", 719, 570, 155, 12, 8, {
        color: "#5e704e",
        letterSpacing: 2,
      }),
      element("leaf", "Botanical corner", "botanical", 821, 454, 127, 182, {
        color: "#7a8c61",
        opacity: 0.5,
        locked: true,
      }),
      border(),
    ],
  };
}

function makeForest(): VoucherDesign {
  const design = classic();
  design.frontColor = "#063d2b";
  design.backColor = "#063d2b";
  for (const item of design.front) {
    if (item.kind === "text")
      item.color = ["subtitle", "tagline", "guest-label", "memory"].includes(item.id)
        ? "#dfca96"
        : "#fffdf8";
    if (item.id === "room")
      Object.assign(item, { x: 490, y: 0, width: 410, height: 480, arch: false });
    if (item.id === "logo")
      Object.assign(item, { x: 56, y: 35, width: 160, height: 72, color: "#fffdf8", radius: 5 });
    if (item.id === "footer") item.color = "#0c4a35";
    if (item.id === "guest-panel")
      Object.assign(item, { color: "#1c5038", stroke: "#b99549", strokeWidth: 1 });
    if (item.kind === "botanical") item.color = "#d7bd78";
    if (item.id === "title") item.text = "A gift of";
    if (item.id === "subtitle") item.text = "stillness.";
    if (item.id === "tagline") item.text = "COMPLIMENTARY STAY VOUCHER";
  }
  for (const item of design.back) {
    if (item.kind === "text") item.color = "#f0e8d3";
    if (item.id === "hero") Object.assign(item, { height: 270, focalY: 30 });
    if (item.id === "logo") Object.assign(item, { color: "#fffdf8", radius: 5 });
    if (item.id === "experience") item.color = "#d7bd78";
    if (item.id === "leaf") item.color = "#d7bd78";
  }
  return design;
}

function makeEditorial(): VoucherDesign {
  const design = classic();
  design.frontColor = "#fffdf8";
  for (const item of design.front) {
    if (item.id === "room")
      Object.assign(item, {
        x: 475,
        y: 35,
        width: 388,
        height: 408,
        arch: false,
        radius: 2,
        focalX: 57,
      });
    if (item.id === "logo") Object.assign(item, { x: 53, y: 38, width: 154, height: 67 });
    if (item.id === "title")
      Object.assign(item, { text: "An invitation", x: 53, y: 168, width: 423, fontSize: 55 });
    if (item.id === "subtitle")
      Object.assign(item, {
        text: "to unwind.",
        x: 53,
        y: 229,
        width: 410,
        color: "#536b49",
        italic: true,
      });
    if (item.id === "tagline")
      Object.assign(item, { text: "COMPLIMENTARY STAY VOUCHER", x: 53, letterSpacing: 1.6 });
    if (item.id === "guest-panel") Object.assign(item, { width: 395, color: "#f1eddf", radius: 0 });
    if (item.id === "couple") item.width = 363;
    if (item.id === "photo-note")
      Object.assign(item, { x: 500, y: 376, width: 338, height: 54, fontSize: 26 });
    if (item.id === "footer") item.color = "#ece5d3";
    if (item.kind === "botanical") item.hidden = true;
    if (item.id === "border")
      Object.assign(item, { x: 20, y: 20, width: 860, height: 560, radius: 0 });
  }
  for (const item of design.back) {
    if (item.id === "hero")
      Object.assign(item, { x: 34, y: 32, width: 512, height: 230, radius: 2 });
    if (item.id === "hero-tint" || item.id === "destination") item.hidden = true;
    if (item.id === "hero-overline")
      Object.assign(item, {
        x: 565,
        y: 75,
        width: 287,
        align: "center",
        color: "#536b49",
        fontSize: 12,
      });
    if (item.id === "hero-heading")
      Object.assign(item, {
        x: 553,
        y: 113,
        width: 311,
        align: "center",
        color: "#063d2b",
        fontSize: 49,
      });
    if (item.id === "hero-subline")
      Object.assign(item, {
        x: 565,
        y: 194,
        width: 287,
        align: "center",
        color: "#536b49",
        fontSize: 12,
      });
    if (item.kind === "botanical") item.hidden = true;
    if (item.id === "border") Object.assign(item, { radius: 0 });
  }
  return design;
}

export function createWorkspace(): DesignWorkspace {
  return {
    template: "classic",
    drafts: { classic: classic(), forest: makeForest(), editorial: makeEditorial() },
  };
}

export function resolveText(value: string, data: VoucherData) {
  return value
    .replaceAll("{{coupleName}}", data.coupleName.trim() || "Your guests")
    .replaceAll("{{sponsorName}}", punctuateName(data.sponsorName) || "Your hosts.");
}

// The optional original invitation gets a reserved footer area in every preset.
export function displayedElement(
  item: DesignElement,
  side: "front" | "back",
  includeMessage: boolean,
): DesignElement {
  if (side !== "front" || !includeMessage) return item;
  const shifts: Record<string, Partial<DesignElement>> = {
    room: { height: Math.max(12, item.height - 37) },
    footer: { y: item.y - 37, height: item.height + 37 },
    title: { y: item.y - 17, fontSize: Math.max(6, (item.fontSize ?? 60) - 4) },
    subtitle: { y: item.y - 22, fontSize: Math.max(6, (item.fontSize ?? 60) - 4) },
    duration: { y: item.y - 30 },
    "guest-panel": { y: item.y - 38 },
    "guest-label": { y: item.y - 38 },
    couple: { y: item.y - 38 },
    location: { y: item.y - 39 },
    condition: { y: item.y - 39 },
    "photo-note": { y: item.y - 37 },
    regards: { y: 522 + (item.y - 520) },
    sponsor: { y: 542 + (item.y - 542) },
  };
  return { ...item, ...shifts[item.id] };
}

export function visibleElement(item: DesignElement, includeMessage: boolean) {
  return (
    !item.hidden &&
    (item.visibility !== "with-message" || includeMessage) &&
    (item.visibility !== "without-message" || !includeMessage)
  );
}
