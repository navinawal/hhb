"use client";

import { Check, Eye, EyeOff, History, LogOut, Save, Send } from "lucide-react";
import { logoutAction } from "@/app/actions/cms";

export default function EditorToolbar({
  dirty,
  status,
  preview,
  storageReady,
  onSave,
  onPublish,
  onTogglePreview,
  onHistory,
}) {
  const working = status === "saving" || status === "publishing";
  const statusText = !storageReady
    ? "Storage setup required"
    : status === "saving"
      ? "Saving draft…"
      : status === "publishing"
        ? "Publishing…"
        : status === "error"
          ? "Action failed"
          : dirty
            ? "Unsaved changes"
            : "Draft saved";

  return (
    <div className="cms-editor-toolbar" role="toolbar" aria-label="Content editor toolbar">
      <div className="cms-toolbar-brand">
        <span className="cms-toolbar-mark" aria-hidden="true"><Check /></span>
        <strong>Holiday Home Bhaktapur editor</strong>
      </div>
      <div className={`cms-toolbar-status cms-toolbar-status-${status}`} role="status">
        <span /> {statusText}
      </div>
      <div className="cms-toolbar-actions">
        <button type="button" onClick={onSave} disabled={working || !dirty || !storageReady}>
          <Save aria-hidden="true" /> Save draft
        </button>
        <button type="button" onClick={onTogglePreview} aria-pressed={preview}>
          {preview ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          {preview ? "Edit" : "Preview"}
        </button>
        <button type="button" onClick={onHistory}><History aria-hidden="true" /> History</button>
        <button className="cms-publish-button" type="button" onClick={onPublish} disabled={working || !storageReady}>
          <Send aria-hidden="true" /> Publish
        </button>
        <form action={logoutAction}>
          <button type="submit"><LogOut aria-hidden="true" /> Log out</button>
        </form>
      </div>
    </div>
  );
}

