"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, RotateCcw, Trash2, X } from "lucide-react";

function getAtPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function formatRevisionDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export default function EditorPanel({ selection, document, revisions, onClose, onApply, onRestore }) {
  const [fieldValues, setFieldValues] = useState(() => selection?.type === "fields"
    ? Object.fromEntries(selection.fields.map((field) => [field.path, structuredClone(getAtPath(document, field.path) ?? (field.list ? [] : ""))]))
    : {});
  const [images, setImages] = useState(() => {
    if (selection?.type !== "images") return [];
    const source = getAtPath(document, selection.path);
    return structuredClone(selection.single ? [source] : (source || []));
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef(null);

  if (!selection) return null;

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/cms/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      const image = selection.path === "gallery"
        ? { ...result.image, heroPosition: "center center", heroMobilePosition: "center center" }
        : result.image;
      setImages((current) => selection.single ? [image] : [...current, image]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function moveImage(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    setImages((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function updateListItem(path, index, value) {
    setFieldValues((current) => ({
      ...current,
      [path]: current[path].map((item, itemIndex) => itemIndex === index ? value : item),
    }));
  }

  function addListItem(path) {
    setFieldValues((current) => ({ ...current, [path]: [...current[path], "New feature"] }));
  }

  function removeListItem(path, index) {
    setFieldValues((current) => ({
      ...current,
      [path]: current[path].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  return (
    <aside className="cms-editor-panel" aria-label={selection.title}>
      <header>
        <div><span>Visual editor</span><h2>{selection.title}</h2></div>
        <button type="button" onClick={onClose} aria-label="Close editor panel"><X /></button>
      </header>

      <div className="cms-panel-content">
        {selection.language && <p className="cms-panel-language">Editing: <strong>{selection.language}</strong></p>}

        {selection.type === "fields" && selection.fields.map((field) => field.list ? (
          <div className="cms-panel-list-field" key={field.path}>
            <span>{field.label}</span>
            <div className="cms-panel-list-items">
              {fieldValues[field.path].map((item, index) => (
                <label key={`${field.path}-${index}`}>
                  <span>{field.itemLabel || "Item"} {index + 1}</span>
                  <input value={item} onChange={(event) => updateListItem(field.path, index, event.target.value)} />
                  <button type="button" onClick={() => removeListItem(field.path, index)} aria-label={`Remove ${field.itemLabel || "item"} ${index + 1}`}><Trash2 /></button>
                </label>
              ))}
            </div>
            <button className="cms-add-list-item" type="button" onClick={() => addListItem(field.path)} disabled={fieldValues[field.path].length >= 12}><Plus /> Add feature</button>
          </div>
        ) : (
          <label className="cms-panel-field" key={field.path}>
            <span>{field.label}</span>
            {field.multiline ? (
              <textarea
                rows={field.rows || 4}
                value={fieldValues[field.path] ?? ""}
                onChange={(event) => setFieldValues((current) => ({ ...current, [field.path]: event.target.value }))}
              />
            ) : (
              <input
                type={field.inputType || "text"}
                value={fieldValues[field.path] ?? ""}
                onChange={(event) => setFieldValues((current) => ({ ...current, [field.path]: event.target.value }))}
              />
            )}
          </label>
        ))}

        {selection.type === "images" && (
          <>
            <p className="cms-panel-help">Upload, describe, remove or reorder the photos. The first image appears first in the slideshow.</p>
            <div className="cms-image-list">
              {images.map((image, index) => (
                <article className="cms-image-item" key={`${image.src}-${index}`}>
                  <div className="cms-image-preview"><Image src={image.src} alt="" fill sizes="96px" /></div>
                  <label>
                    <span>Alternative text</span>
                    <input value={image.alt} onChange={(event) => setImages((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, alt: event.target.value } : item))} />
                  </label>
                  <div className="cms-image-actions">
                    <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label="Move image earlier"><ArrowUp /></button>
                    <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} aria-label="Move image later"><ArrowDown /></button>
                    <button type="button" onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))} disabled={images.length === 1} aria-label="Remove image"><Trash2 /></button>
                  </div>
                </article>
              ))}
            </div>
            <input ref={fileInput} className="cms-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} />
            <button className="cms-upload-button" type="button" onClick={() => fileInput.current?.click()} disabled={uploading || images.length >= 12}>
              <ImagePlus /> {uploading ? "Uploading…" : "Upload another photo"}
            </button>
          </>
        )}

        {selection.type === "history" && (
          <div className="cms-revision-list">
            {revisions.length === 0 && <p className="cms-panel-help">Published revisions will appear here after the first publish.</p>}
            {revisions.map((revision) => (
              <article key={revision.pathname}>
                <div><strong>Published version</strong><span>{formatRevisionDate(revision.uploadedAt)}</span></div>
                <button type="button" onClick={() => onRestore(revision.pathname)}><RotateCcw /> Restore as draft</button>
              </article>
            ))}
          </div>
        )}

        {error && <p className="cms-form-error" role="alert">{error}</p>}
      </div>

      {selection.type !== "history" && (
        <footer>
          <button type="button" onClick={onClose}>Cancel</button>
          <button
            className="cms-primary-button"
            type="button"
            onClick={() => {
              if (selection.type === "images") onApply([{ path: selection.path, value: selection.single ? images[0] : images }]);
              else onApply(selection.fields.map((field) => ({ path: field.path, value: fieldValues[field.path] ?? "" })));
            }}
          >
            Apply changes
          </button>
        </footer>
      )}
    </aside>
  );
}
