"use client";

import { useRef, useState } from "react";
import { Paperclip, X, ImageIcon, Loader2 } from "lucide-react";
import { apiUpload } from "@/lib/api";

function FilePreview({ file, onRemove }) {
  const isImage = file.mimeType?.startsWith("image/");
  return (
    <div className="relative flex items-center gap-2 rounded-lg border border-border bg-background p-2 text-xs">
      {isImage && file.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file.url} alt={file.originalName} className="size-10 rounded object-cover shrink-0" />
      ) : (
        <ImageIcon className="size-10 shrink-0 text-muted-foreground" />
      )}
      <span className="flex-1 truncate text-muted-foreground">{file.originalName}</span>
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        aria-label="Remove file"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

export function FileUpload({ value = [], onChange, accept = "image/*,video/*", maxFiles = 5, purpose = "general", admin = false }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    const remaining = maxFiles - value.length;
    if (remaining <= 0) {
      setError(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    setError(null);

    const results = [];
    for (const file of toUpload) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("purpose", purpose);
      try {
        const asset = await apiUpload("/storage/uploads", fd, { admin });
        results.push({ id: asset.id, url: asset.url, mimeType: asset.mimeType, originalName: asset.originalName ?? file.name });
      } catch (err) {
        setError(err.message ?? "Upload failed");
      }
    }

    if (results.length > 0) {
      onChange([...value, ...results]);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove(id) {
    onChange(value.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="grid gap-1.5 sm:grid-cols-2">
          {value.map((f) => (
            <FilePreview key={f.id} file={f} onRemove={handleRemove} />
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-brand-blue/50 hover:text-brand-blue disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Paperclip className="size-4" />
          )}
          {uploading ? "Uploading…" : "Attach photos / files"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
