"use client";

import { Pencil } from "lucide-react";

export default function CmsEditButton({ enabled, label, descriptor, onEdit, className = "" }) {
  if (!enabled) return null;
  return (
    <button
      className={`cms-pencil-button ${className}`.trim()}
      type="button"
      aria-label={label}
      title={label}
      data-cms-edit={descriptor.id}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onEdit?.(descriptor);
      }}
    >
      <Pencil aria-hidden="true" />
    </button>
  );
}

