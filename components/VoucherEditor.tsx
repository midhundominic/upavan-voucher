"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCheck,
  ChevronDown,
  Heart,
  ImageIcon,
  Info,
  Leaf,
  LogOut,
  Mail,
  RotateCcw,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { signOut, restoreDefaults } from "@/app/actions";
import { Botanical } from "@/components/Botanical";
import { ImageUploader } from "@/components/ImageUploader";
import { ResortLogo } from "@/components/ResortLogo";
import { ResetDialog } from "@/components/ResetDialog";
import { VoucherPreview } from "@/components/VoucherPreview";
import { ASSETS, MAX_NAME_LENGTH } from "@/lib/defaults";
import { loadNames, saveNames } from "@/lib/storage";
import type { AssetKey, ExportAction, VoucherData, VoucherView } from "@/types/voucher";
import { useDesigner } from "@/lib/useDesigner";
import { TemplatePicker } from "@/components/TemplatePicker";
import { DesignInspector } from "@/components/DesignInspector";

export function VoucherEditor({ defaults }: { defaults: VoucherData }) {
  const designer = useDesigner();
  const [data, setData] = useState(defaults);
  const [hydrated, setHydrated] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [view, setView] = useState<VoucherView>("front");
  const [includeMessage, setIncludeMessage] = useState(false);
  const [busy, setBusy] = useState<ExportAction | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [assetGeneration, setAssetGeneration] = useState(0);
  const [uploading, setUploading] = useState<Set<AssetKey>>(new Set());
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null);
  const objectUrls = useRef(new Map<AssetKey, string>());
  const frontRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLElement>(null);
  const exportLock = useRef(false);

  useEffect(() => {
    // Defer browser-only storage until hydration to keep server markup consistent.
    const timer = window.setTimeout(() => {
      const names = loadNames();
      setData((value) => ({ ...value, ...names }));
      setStorageOk(saveNames(names));
      setHydrated(true);
    }, 0);
    const urls = objectUrls.current;
    return () => {
      window.clearTimeout(timer);
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  useEffect(() => {
    if (!notice || notice.error) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function updateAsset(key: AssetKey, src: string) {
    const old = objectUrls.current.get(key);
    if (src.startsWith("blob:")) objectUrls.current.set(key, src);
    else objectUrls.current.delete(key);
    setData((value) => ({ ...value, [key]: src }));
    if (old && old !== src) URL.revokeObjectURL(old);
  }

  function updateName(key: "coupleName" | "sponsorName", name: string) {
    const updated = { ...data, [key]: name };
    setData(updated);
    setStorageOk(saveNames(updated));
  }

  function updateUploading(key: AssetKey, loading: boolean) {
    setUploading((current) => {
      const next = new Set(current);
      if (loading) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  async function handleExport(action: ExportAction) {
    if (exportLock.current || uploading.size > 0 || !frontRef.current || !backRef.current) return;
    if (!data.coupleName.trim() || !data.sponsorName.trim()) {
      setNotice({
        message: "Add both the couple name and sponsor name before exporting.",
        error: true,
      });
      return;
    }
    exportLock.current = true;
    setBusy(action);
    setNotice(null);
    try {
      const { exportVoucher } = await import("@/lib/exportVoucher");
      await exportVoucher(action, frontRef.current, backRef.current, data.coupleName);
      if (action !== "print")
        setNotice({
          message:
            action === "pdf"
              ? "Your two-page voucher PDF is ready."
              : `Your ${action} voucher PNG is ready.`,
          error: false,
        });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : "The export could not be completed. Please try again.",
        error: true,
      });
    } finally {
      setBusy(null);
      exportLock.current = false;
    }
  }

  async function resetVoucher() {
    setResetting(true);
    try {
      const restored = await restoreDefaults();
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
      setData(restored);
      setStorageOk(saveNames(restored));
      setIncludeMessage(false);
      designer.reset();
      setView("front");
      setAssetGeneration((value) => value + 1);
      setResetOpen(false);
      setNotice({
        message: "Your voucher has been restored to its original details.",
        error: false,
      });
    } catch {
      setNotice({
        message: "Could not reset the voucher. Check your connection or sign in again.",
        error: true,
      });
    } finally {
      setResetting(false);
    }
  }

  const disabled = !hydrated || !designer.ready || busy !== null || resetting;
  return (
    <>
      <header className="app-header no-print">
        <div className="header-inner">
          <Link href="/" className="header-brand" aria-label="Upavan Resort Voucher Designer home">
            <ResortLogo src={defaults.logo} className="header-logo" />
            <span className="header-divider" />
            <span className="header-title">
              Voucher Designer<small>UPAVAN RESORT · WAYANAD</small>
            </span>
          </Link>
          <div className="header-right">
            <span className="private-label">
              <ShieldCheck size={14} strokeWidth={1.5} />
              Private workspace
            </span>
            <form action={signOut}>
              <button className="signout-button" title="Sign out" aria-label="Sign out">
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="page-intro no-print">
          <div>
            <p className="eyebrow">
              <span /> THE ART OF GIVING
            </p>
            <h1>
              Gift a moment of <em>stillness.</em>
            </h1>
            <p className="intro-description">Create a personalized complimentary stay voucher.</p>
          </div>
          <div className="intro-note">
            <Botanical />
            <span>
              A thoughtful gesture.
              <br />
              <em>A beautiful escape.</em>
            </span>
          </div>
        </div>
        <TemplatePicker
          selected={designer.workspace.template}
          onSelect={designer.setTemplate}
          disabled={disabled}
          image={data.mainRoomImage}
        />
        <div className="designer-grid">
          <aside className="controls-panel no-print" aria-label="Voucher personalization">
            <div className="control-mode-tabs">
              <button
                type="button"
                aria-pressed={!designer.editing}
                disabled={disabled}
                onClick={() => designer.setEditing(false)}
              >
                Personalize
              </button>
              <button
                type="button"
                aria-pressed={designer.editing}
                disabled={disabled}
                onClick={() => designer.setEditing(true)}
              >
                Design & layers
              </button>
            </div>
            {designer.editing && (
              <DesignInspector
                designer={designer}
                side={view === "both" ? (designer.selected?.side ?? "front") : view}
                disabled={disabled}
                onSideChange={setView}
              />
            )}
            <div className="personalization-sections" hidden={designer.editing}>
              <section className="control-card details-card">
                <div className="control-heading">
                  <span className="section-icon">
                    <Users size={18} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h2>Voucher Details</h2>
                    <p>A personal touch goes a long way.</p>
                  </div>
                  <span className="section-number" aria-hidden="true">
                    01
                  </span>
                </div>
                <div className="form-fields">
                  <div className="field-group">
                    <label htmlFor="couple-name">
                      Couple Name
                      <Heart size={12} />
                    </label>
                    <input
                      id="couple-name"
                      value={data.coupleName}
                      onChange={(event) => updateName("coupleName", event.target.value)}
                      maxLength={MAX_NAME_LENGTH}
                      placeholder="Enter the couple’s names"
                      autoComplete="off"
                      disabled={disabled}
                      aria-describedby="couple-hint"
                    />
                    <span id="couple-hint" className="field-hint">
                      The names that make this stay special.
                    </span>
                  </div>
                  <div className="field-group">
                    <label htmlFor="sponsor-name">Sponsor / Regards Name</label>
                    <input
                      id="sponsor-name"
                      value={data.sponsorName}
                      onChange={(event) => updateName("sponsorName", event.target.value)}
                      maxLength={MAX_NAME_LENGTH}
                      placeholder="Enter the sender’s names"
                      autoComplete="off"
                      disabled={disabled}
                      aria-describedby="sponsor-hint"
                    />
                    <span id="sponsor-hint" className="field-hint">
                      Shown with your warm regards.
                    </span>
                  </div>
                </div>
                <div
                  className={`saved-indicator ${!storageOk ? "storage-warning" : ""}`}
                  role="status"
                >
                  <CheckCheck size={14} />
                  {!hydrated
                    ? "Loading your details…"
                    : storageOk
                      ? "Names are saved on this device"
                      : "Browser storage is unavailable; names won’t persist"}
                </div>
              </section>
              <section className="control-card assets-card">
                <div className="control-heading">
                  <span className="section-icon">
                    <ImageIcon size={18} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h2>Resort Assets</h2>
                    <p>Set the scene for their escape.</p>
                  </div>
                  <span className="section-number" aria-hidden="true">
                    02
                  </span>
                </div>
                <div className="assets-list">
                  {ASSETS.map((asset) => (
                    <ImageUploader
                      key={`${assetGeneration}-${asset.key}`}
                      asset={asset}
                      src={data[asset.key]}
                      onChange={(src) => updateAsset(asset.key, src)}
                      onLoadingChange={(loading) => updateUploading(asset.key, loading)}
                      disabled={disabled}
                    />
                  ))}
                </div>
                <div className="assets-help">
                  <Info size={13} />
                  <p>
                    Drop an image onto any row, or select to upload.
                    <br />
                    PNG, JPG, WEBP · up to 15 MB each.
                    <br />
                    <span>Uploads stay private in this tab until refresh.</span>
                  </p>
                </div>
              </section>
              <section className="control-card message-card">
                <div className="message-toggle-row">
                  <Mail size={18} strokeWidth={1.5} />
                  <label htmlFor="include-message">
                    <strong>A note from the heart</strong>
                    <span>Include the original invitation</span>
                  </label>
                  <button
                    id="include-message"
                    type="button"
                    role="switch"
                    aria-checked={includeMessage}
                    aria-label="Include original invitation message"
                    className="toggle-switch"
                    onClick={() => setIncludeMessage(!includeMessage)}
                    disabled={disabled}
                  >
                    <span />
                  </button>
                </div>
                <details className="invitation-details">
                  <summary>
                    Read the message <ChevronDown size={13} />
                  </summary>
                  <div>
                    <p>Dear {data.coupleName.trim() || "our guests"},</p>
                    <p>
                      We invite you to stay at Upavan Resort, Wayanad for a day and a night at your
                      convenience, except on Saturdays and Sundays. Please let us know the date of
                      your convenience.
                    </p>
                    <p>
                      With warm regards and best wishes,
                      <br />
                      <strong>
                        {data.sponsorName.trim().replace(/[.。]+$/u, "") || "Your hosts"}.
                      </strong>
                    </p>
                  </div>
                </details>
              </section>
            </div>
            <button
              className="reset-button"
              type="button"
              onClick={() => setResetOpen(true)}
              disabled={disabled || uploading.size > 0}
            >
              <RotateCcw size={14} />
              Reset Voucher
            </button>
          </aside>
          <VoucherPreview
            data={data}
            view={view}
            setView={setView}
            frontRef={frontRef}
            backRef={backRef}
            includeMessage={includeMessage}
            busy={busy}
            disabled={disabled || uploading.size > 0}
            onExport={(action) => void handleExport(action)}
            designer={designer}
          />
        </div>
        <footer className="app-footer no-print">
          <span>
            <Leaf size={13} /> A little closer to nature. A little closer to each other.
          </span>
          <span>UPAVAN RESORT, WAYANAD</span>
        </footer>
      </main>
      <ResetDialog
        open={resetOpen}
        busy={resetting}
        onClose={() => setResetOpen(false)}
        onConfirm={() => void resetVoucher()}
      />
      {notice && (
        <div
          className={`toast no-print ${notice.error ? "toast-error" : ""}`}
          role={notice.error ? "alert" : "status"}
        >
          {notice.error ? <Info size={18} /> : <Check size={18} />}
          <span>{notice.message}</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
