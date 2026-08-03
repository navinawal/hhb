"use client";

import { useState } from "react";
import { publishAction, restoreRevisionAction, saveDraftAction } from "@/app/actions/cms";
import HolidayHomePage, { resolveSiteContent } from "@/components/HolidayHomePage";
import EditorPanel from "@/components/cms/EditorPanel";
import EditorToolbar from "@/components/cms/EditorToolbar";

function setAtPath(source, path, value) {
  const next = structuredClone(source);
  const keys = path.split(".");
  let target = next;
  keys.slice(0, -1).forEach((key) => {
    target = target[key];
  });
  target[keys.at(-1)] = value;
  return next;
}

export default function VisualEditor({ initialDocument, revisions, storageStatus }) {
  const [document, setDocument] = useState(() => resolveSiteContent(initialDocument));
  const [selection, setSelection] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);

  function applyChanges(changes) {
    setDocument((current) => changes.reduce((next, change) => setAtPath(next, change.path, change.value), current));
    setDirty(true);
    setStatus("idle");
    setMessage("");
    setSelection(null);
  }

  async function saveDraft() {
    setStatus("saving");
    setMessage("");
    try {
      const result = await saveDraftAction(JSON.stringify(document), document.updatedAt);
      if (!result.ok) throw new Error(result.error);
      setDocument(resolveSiteContent(result.document));
      setDirty(false);
      setStatus("success");
      setMessage("Draft saved. The live website has not changed.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The draft could not be saved.");
    }
  }

  async function publish() {
    if (!window.confirm("Publish all current edits to the live website?")) return;
    setStatus("publishing");
    setMessage("");
    try {
      const result = await publishAction(JSON.stringify(document), document.updatedAt);
      if (!result.ok) throw new Error(result.error);
      setDocument(resolveSiteContent(result.document));
      setDirty(false);
      setStatus("success");
      setMessage("Published successfully. Visitors can now see these changes.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The website could not be published.");
    }
  }

  async function restore(pathname) {
    if (!window.confirm("Restore this published version as a draft? The live website will remain unchanged.")) return;
    setStatus("saving");
    try {
      const result = await restoreRevisionAction(pathname);
      if (!result.ok) throw new Error(result.error);
      setDocument(resolveSiteContent(result.document));
      setDirty(false);
      setSelection(null);
      setStatus("success");
      setMessage("Revision restored as a draft. Review it before publishing.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The revision could not be restored.");
    }
  }

  return (
    <div className={`cms-editor-shell ${selection ? "cms-panel-open" : ""} ${preview ? "cms-preview-mode" : ""}`}>
      <EditorToolbar
        dirty={dirty}
        status={status}
        preview={preview}
        storageReady={storageStatus.ready}
        onSave={saveDraft}
        onPublish={publish}
        onTogglePreview={() => { setPreview((current) => !current); setSelection(null); }}
        onHistory={() => { setPreview(false); setSelection({ id: "history", type: "history", title: "Published history" }); }}
      />
      {message && <div className={`cms-editor-toast cms-editor-toast-${status}`} role="status">{message}</div>}
      <div className="cms-editor-canvas">
        <HolidayHomePage cmsContent={document} editorMode={!preview} onEdit={setSelection} />
      </div>
      <EditorPanel
        key={selection?.id || "closed"}
        selection={selection}
        document={document}
        revisions={revisions}
        onClose={() => setSelection(null)}
        onApply={applyChanges}
        onRestore={restore}
      />
    </div>
  );
}
