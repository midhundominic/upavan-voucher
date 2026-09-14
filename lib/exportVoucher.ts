import type { ExportAction } from "@/types/voucher";

const WIDTH = 900;
const HEIGHT = 600;
const PIXEL_RATIO = 2;

async function waitForArtwork(nodes: HTMLElement[]) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.all([
        document.fonts.ready,
        ...nodes
          .flatMap((node) => Array.from(node.querySelectorAll("img")))
          .map(async (image) => {
            if (!image.complete) await image.decode();
            if (!image.naturalWidth)
              throw new Error("An image could not be loaded. Replace it and try again.");
          }),
      ]),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("Images are still loading. Please wait a moment and try again.")),
          15000,
        );
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}

function download(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function filenameFor(name: string) {
  const slug = name
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)
    .toLowerCase();
  return `upavan-${slug || "stay-voucher"}`;
}

export async function exportVoucher(
  action: ExportAction,
  front: HTMLElement,
  back: HTMLElement,
  coupleName: string,
) {
  const nodes = action === "front" ? [front] : action === "back" ? [back] : [front, back];
  await waitForArtwork(nodes);
  if (action === "print") {
    window.print();
    return;
  }

  const { toPng, getFontEmbedCSS } = await import("html-to-image");
  // next/font already serves WOFF2. Filtering by format in html-to-image 1.11.13
  // can drop alternating font sources and change the exported typography.
  const fontEmbedCSS = await getFontEmbedCSS(front);
  async function capture(node: HTMLElement) {
    return toPng(node, {
      width: WIDTH,
      height: HEIGHT,
      pixelRatio: PIXEL_RATIO,
      backgroundColor: getComputedStyle(node).backgroundColor,
      fontEmbedCSS,
      cacheBust: false,
      includeQueryParams: true,
      style: { transform: "none", margin: "0", boxShadow: "none" },
    });
  }
  const filename = filenameFor(coupleName);
  if (action === "front" || action === "back") {
    download(await capture(action === "front" ? front : back), `${filename}-${action}.png`);
    return;
  }

  const { jsPDF } = await import("jspdf");
  // 6 × 4 inches at 300 DPI: two 1800 × 1200 images on separate 3:2 pages.
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [152.4, 101.6],
    compress: true,
  });
  pdf.setProperties({
    title: `Upavan Resort — Complimentary Stay for ${coupleName}`,
    subject: "Complimentary stay voucher",
    creator: "Upavan Voucher Designer",
  });
  pdf.addImage(await capture(front), "PNG", 0, 0, 152.4, 101.6, "front", "FAST");
  pdf.addPage([152.4, 101.6], "landscape");
  pdf.addImage(await capture(back), "PNG", 0, 0, 152.4, 101.6, "back", "FAST");
  pdf.save(`${filename}.pdf`);
}
