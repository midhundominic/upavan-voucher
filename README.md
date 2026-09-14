# Upavan Resort Voucher Designer

A responsive Next.js App Router application for creating a personalized, two-sided complimentary stay voucher. Includes private sign-in, three editable templates, a visual canvas editor, local image uploads, 1800 × 1200 PNGs, a two-page PDF, and print styling. No database is required.

## Run locally

Requires Node.js 20.9 or newer (Node.js 22/24 LTS recommended).

```sh
npm install
cp .env.example .env.local
openssl rand -hex 32
```

Edit `.env.local` (a root `.env` also works):

```dotenv
AUTH_EMAIL=your-email@example.com
AUTH_PASSWORD="your-unique-password-of-at-least-8-characters"
AUTH_SECRET="paste-the-random-secret-generated-above"
```

Then run:

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000) and sign in with your configured email and password. Until these variables are configured, the login page shows setup instructions and keeps the designer locked. Restart the server after editing environment variables. Do not use `NEXT_PUBLIC_` prefixes or commit credential files.

For production: `npm run build` followed by `npm start`. Deploy to a Node.js-compatible Next.js host with HTTPS and set the same environment variables. Sign-in requires a server; static HTML hosting is not supported. Google Fonts are downloaded at build time by `next/font` and then served locally.

## Logo, seal, and photographs

Place or replace these files inside `public/assets/`:

| File                  | Placement                                             |
| --------------------- | ----------------------------------------------------- |
| `upavan-logo.png`     | Resort logo on the front, back, and app header        |
| `upavan-favicon.svg`  | Square browser-tab icon with the original resort logo |
| `upavan-seal.png`     | Original resort seal next to the sponsor on the front |
| `room-main.jpg`       | Main front photograph                                 |
| `resort-pool.jpg`     | Back hero photograph                                  |
| `room-2.jpg`          | First gallery photograph                              |
| `restaurant.jpg`      | Second gallery photograph                             |
| `view.jpg`            | Third gallery photograph                              |
| `resort-property.jpg` | Sign-in page photograph                               |

Existing files load by default. Reload the page after replacing a source file; production deployments should be rebuilt. The **Reset Voucher** button also checks the default files again. Missing photos have neutral botanical placeholders, and a missing logo has a simple text fallback. The seal is **never recreated**: upload your actual seal or add `upavan-seal.png`; until then, it is omitted from the voucher. Transparency and aspect ratio are preserved with `object-fit: contain`.

The **Resort Assets** panel supports click-to-upload, drag-and-drop, replace, and remove for all seven voucher assets, including the seal. Accepts PNG, JPG/JPEG, and WEBP up to 15 MB and 40 megapixels. Images are decoded and validated before appearing. Browser object URLs are released on replace, remove, reset, and exit. Uploads never leave the browser and last only for the current tab session. Names and template layouts persist after refresh; uploaded photos return to the source defaults.

The browser favicon uses `public/assets/upavan-favicon.svg`: the original logo embedded in a square SVG with its transparent side margins excluded, its proportions preserved, and a cream background for visibility on dark tabs. The favicon has its own URL to avoid the previously cached wide logo. If changing the resort branding, update this SVG as well. The Apple touch icon uses `public/assets/upavan-logo.png`. Replacing a voucher logo temporarily through the upload panel does not change the site favicon.

Bundled logo and example resort photographs were downloaded from the [official Upavan Resort website](https://www.upavanresort.com/); exact source URLs are recorded in [public/assets/SOURCES.md](public/assets/SOURCES.md). These are official website defaults, not local copies of every chat attachment. Replace them with your preferred originals using the editor or filenames above.

## Personalize the voucher

Edit **Couple Name** and **Sponsor / Regards Name** for an instant preview. Both names are stored locally in your browser under `upavan-voucher:v1`, with graceful recovery if storage is blocked or corrupted. Use **Design & layers** to customize the rest of the wording and composition.

To change the initial names in the code, edit `coupleName` and `sponsorName` in `lib/defaults.ts`. Previously saved browser names take priority; use **Reset Voucher** to restore the source defaults. Reset asks for confirmation before clearing names, uploads, and all three template drafts and restoring the source defaults.

Use **Front**, **Back**, or **Show Both** above the preview. Enable **A note from the heart** to include the original invitation on the front; the names are drawn from the same fields. Names support up to 80 characters and scale down for longer entries. The sponsor receives one trailing period.

## Templates and visual editing

Choose **Classic Garden**, **Forest Retreat**, or **Ivory Editorial** above the workspace. Each includes front and back artwork. Switching templates preserves the edits to each design. Drafts and the selected template are saved locally under `upavan-design:v1`; they do not sync between devices. Template definitions live in `lib/templates.ts`.

Select **Edit design** or **Design & layers**, then click a voucher element or choose it in the **Layers** panel:

- Drag an element to move it; drag its bottom-right handle to resize. Center guides snap elements into place. Hold Alt/Option to bypass snapping; hold Shift while resizing to preserve the frame ratio. Logo and seal images always retain their aspect ratio inside their frames.
- Edit text, typeface, font size, bold, italic, alignment, and color in the left panel. Double-click text, or press Enter on a selected text element, to focus its content field. Text automatically shrinks to fit its frame; enlarge the frame if needed.
- Keep `{{coupleName}}` and `{{sponsorName}}` in text to link it to the personalization fields. Replacing those tokens with ordinary text makes that particular element independent.
- Select a photograph to change its image source, crop position, or corner radius. **Replace image** opens the upload control for that source; replacing a shared source updates every layer using it.
- Use **Add text**, **Photo**, and **Shape** to add elements. Adjust position, size, rotation, opacity, and card background. Duplicate, delete, or change stacking order using the inspector buttons; hide or show layers using the eye buttons.
- Background decorations start locked. Select them in the layer list and unlock to edit. Up to 100 layers are supported per side.
- Undo and redo retain the last 40 design actions during the current page session. With the canvas focused: arrow keys move 1 px, Shift + arrows move 10 px, Delete removes the selected unlocked element, Escape clears selection or cancels a drag, and Ctrl/Cmd + Z (Shift for redo) controls history. The resize handle also supports arrow keys.

**Finish editing** shows the clean preview. Exports always include the current template's artwork and exclude selection borders, handles, and editor controls. The interface uses larger labels and 16 px name inputs on desktop and mobile.

## Download and print

- **Download Front PNG / Download Back PNG:** `html-to-image` waits for fonts and images, embeds the local assets and fonts, and rasterizes only the relevant 900 × 600 card at 2× resolution, producing **1800 × 1200** pixels. Downloads use the couple's name in the filename.
- **Download Both as PDF:** jsPDF places these images on two **6 × 4 inch landscape** pages, front first and back second. This corresponds to 300 pixels per inch. The PDF contains raster artwork and has no crop marks or bleed.
- **Print Voucher:** opens the browser print dialog. Print CSS hides the app controls and shows both sides on separate A4 landscape pages with accurate colors and an unchanged 3:2 card ratio. Turn off browser headers/footers; keep background graphics enabled if your browser requires it. The two-page PDF provides a consistent alternative across print drivers.

Export libraries load on demand. Export and reset controls disable while processing, and errors appear as accessible notifications. Image sharpness still depends on the original uploaded resolution. For the most consistent browser-side PNG capture, use a current Chrome or Edge browser.

## Sign-in behavior

Credentials are checked exclusively on the server with constant-time digest comparisons. Sessions use signed HS256 JWTs in an HTTP-only, SameSite cookie, expire after 12 hours, and use Secure cookies in production. Changing the email, password, or signing secret invalidates existing sessions. The designer and reset server action require a valid session. Next.js server actions enforce their origin checks.

Login attempts are limited in memory per IP and globally. This protection is per server process and resets when the process restarts; configure shared rate limiting at your hosting edge if running multiple instances. Sign-in protects the designer, while bundled `public/assets` files remain public. No credentials are stored in localStorage. Use **Sign out** on shared devices; guest names remain saved on that browser as requested.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

To run the same browser checks against the optimized build, run `npm run build`, then `E2E_PRODUCTION=1 npm run test:e2e` (macOS/Linux). `npm run format:check` verifies source formatting.

Browser tests use an isolated server at port 3100 and test-only credentials. They use installed Google Chrome on macOS; elsewhere install Chromium with `npx playwright install chromium`. Coverage includes login/logout, rejected credentials and tampered cookies, localStorage recovery, personalization, uploads and reset, mobile readability, template persistence, canvas movement and resizing, undo/redo, text styling, layer controls, accessibility, actual PNG dimensions, and two-page PDF/print output. Screenshots and example downloads are written under `test-results/artifacts/`. Use the production test command if a development server for this project is already running.

## Project structure

`app/` contains pages, server actions, fonts, and styling. `components/` contains the template picker, canvas, property inspector, layer list, reusable voucher artwork, asset controls, toolbar, and sign-in form. `lib/` contains template definitions, design history, local storage, defaults, export, authentication, and asset discovery. `types/voucher.ts` and `types/design.ts` define voucher data and editable artwork.
