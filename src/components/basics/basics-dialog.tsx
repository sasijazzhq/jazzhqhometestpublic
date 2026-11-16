"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Modal dialog on the native <dialog> element: showModal() makes the page
// inert and Escape closes it. Tab is additionally kept inside the dialog, and
// focus returns to the element that opened it.
export function BasicsDialog({ open, onClose, titleId, labelledBy, children, className = "" }: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      // Start on the first field if there is one, otherwise on the close button.
      (dialog.querySelector<HTMLElement>("input") ?? dialog.querySelector<HTMLElement>(FOCUSABLE))?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Unmounting while open (e.g. browser Back from the Basics view) still returns focus sensibly.
  useEffect(() => () => { if (ref.current?.open) ref.current.close(); }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return (
    <dialog
      ref={ref}
      className={`bx-dialog ${className}`.trim()}
      aria-labelledby={labelledBy ?? titleId}
      onKeyDown={onKeyDown}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClose={() => {
        const target = returnTo.current;
        returnTo.current = null;
        if (open) onClose();
        if (target?.isConnected) target.focus({ preventScroll: true });
      }}
      onClick={(event) => { if (event.target === ref.current) onClose(); }}
    >
      <div className="bx-dialog__body">
        <button type="button" className="bx-dialog__close" aria-label="Close" onClick={onClose}>
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
