"use client";

import { useCallback, useState } from "react";

/**
 * Uploads a picked file to the admin image endpoint and writes the returned URL
 * onto a form field. `uploadingField` names the field currently in flight.
 */
export function useImageUpload({ folder, onUploaded, onError }) {
  const [uploadingField, setUploadingField] = useState(null);

  const upload = useCallback(
    async (event, field) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setUploadingField(field);
      onError?.("");
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) return onError?.(data.error || "Upload failed");
        onUploaded(field, data.url);
      } finally {
        setUploadingField(null);
        event.target.value = "";
      }
    },
    [folder, onUploaded, onError],
  );

  return { uploadingField, uploading: uploadingField != null, upload };
}
