"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { Check, ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import { AssetImage } from "@/components/AssetImage";
import { MAX_IMAGE_BYTES, MAX_IMAGE_PIXELS } from "@/lib/defaults";
import type { AssetDefinition } from "@/types/voucher";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

async function validateImage(file: File, url: string) {
  if (!ALLOWED_TYPES.includes(file.type) || !/\.(png|jpe?g|webp)$/i.test(file.name))
    throw new Error("Choose a PNG, JPG, JPEG, or WEBP image.");
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error("This image is too large. Choose a file under 15 MB.");
  if (file.size === 0) throw new Error("This file is empty. Please choose another image.");
  const image = new Image();
  image.src = url;
  await image.decode().catch(() => {
    throw new Error("This image could not be opened. Please choose another file.");
  });
  if (image.naturalWidth * image.naturalHeight > MAX_IMAGE_PIXELS)
    throw new Error("Choose an image smaller than 40 megapixels.");
}

export function ImageUploader({
  asset,
  src,
  onChange,
  onLoadingChange,
  disabled,
}: {
  asset: AssetDefinition;
  src: string;
  onChange: (src: string) => void;
  onLoadingChange: (loading: boolean) => void;
  disabled: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const generation = useRef(0);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );

  async function acceptFiles(files: FileList | null) {
    if (disabled || !files?.length) return;
    if (files.length !== 1) {
      setError("Please choose one image at a time.");
      return;
    }
    const request = ++generation.current;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setError("");
    setLoading(true);
    onLoadingChange(true);
    try {
      await validateImage(file, url);
      if (request !== generation.current) {
        URL.revokeObjectURL(url);
        return;
      }
      onChange(url);
      setAnnouncement(`${asset.label} updated.`);
    } catch (cause) {
      URL.revokeObjectURL(url);
      if (request === generation.current)
        setError(cause instanceof Error ? cause.message : "Please try another image.");
    } finally {
      if (request === generation.current) {
        setLoading(false);
        onLoadingChange(false);
      }
      if (input.current) input.current.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    void acceptFiles(event.dataTransfer.files);
  }

  return (
    <div
      className={`asset-upload ${dragging ? "is-dragging" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={(event) => {
        event.preventDefault();
        dragDepth.current++;
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => {
        dragDepth.current--;
        if (dragDepth.current <= 0) setDragging(false);
      }}
      onDrop={onDrop}
    >
      <div className="asset-row">
        <button
          type="button"
          className={`asset-thumbnail ${asset.fit === "contain" ? "contain" : ""}`}
          onClick={() => input.current?.click()}
          disabled={disabled || loading}
          aria-label={`Upload ${asset.label}`}
        >
          <AssetImage
            src={src}
            alt={`${asset.label} thumbnail`}
            loading="lazy"
            fallback="thumbnail"
          />
          <span className="thumbnail-hover">
            {loading ? <LoaderCircle className="spin" size={18} /> : <Upload size={17} />}
          </span>
        </button>
        <div className="asset-label">
          <label htmlFor={`asset-${asset.key}`}>{asset.label}</label>
          <span>
            {loading
              ? "Preparing image…"
              : asset.key === "seal" && !src
                ? "Upload the original seal"
                : asset.description}
          </span>
        </div>
        <div className="asset-actions">
          <button
            type="button"
            className="replace-button"
            onClick={() => input.current?.click()}
            disabled={disabled || loading}
            aria-label={`${src ? "Replace" : "Add"} ${asset.label}`}
          >
            {src ? (
              "Replace"
            ) : (
              <>
                <ImagePlus size={13} /> Add
              </>
            )}
          </button>
          {src && (
            <button
              type="button"
              className="icon-button remove-asset"
              title={`Remove ${asset.label}`}
              aria-label={`Remove ${asset.label}`}
              disabled={disabled || loading}
              onClick={() => {
                generation.current++;
                onChange("");
                setError("");
                setAnnouncement(`${asset.label} removed.`);
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <input
          ref={input}
          id={`asset-${asset.key}`}
          className="sr-only"
          type="file"
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          disabled={disabled || loading}
          onChange={(event) => void acceptFiles(event.target.files)}
        />
      </div>
      {error && (
        <p className="upload-error" role="alert">
          {error}
        </p>
      )}
      <span className="sr-only" role="status">
        {announcement}
      </span>
      {dragging && (
        <span className="drop-label">
          <Check size={16} /> Drop to replace
        </span>
      )}
    </div>
  );
}
