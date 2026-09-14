"use client";

import { useEffect, useRef } from "react";
import { LoaderCircle, RotateCcw, X } from "lucide-react";

export function ResetDialog({
  open,
  busy,
  onClose,
  onConfirm,
}: {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="reset-dialog"
      aria-labelledby="reset-title"
      aria-describedby="reset-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current && !busy) onClose();
      }}
    >
      <div className="dialog-inner">
        <button
          type="button"
          className="icon-button dialog-close"
          aria-label="Close reset dialog"
          onClick={onClose}
          disabled={busy}
        >
          <X size={19} />
        </button>
        <div className="dialog-icon">
          <RotateCcw size={23} strokeWidth={1.5} />
        </div>
        <h2 id="reset-title">A fresh beginning?</h2>
        <p id="reset-description">
          Reset the guest and sponsor names, remove uploaded images, and restore the original resort
          assets. Your current changes will be cleared.
        </p>
        <div className="dialog-actions">
          <button
            type="button"
            className="button button-outline"
            onClick={onClose}
            disabled={busy}
            autoFocus
          >
            Keep editing
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy && <LoaderCircle size={15} className="spin" />}Reset Voucher
          </button>
        </div>
      </div>
    </dialog>
  );
}
