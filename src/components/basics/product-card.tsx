"use client";

import { useState } from "react";
import { AudioLines, Handshake } from "lucide-react";
import { PRODUCT_LINK_PENDING, type BasicsProduct } from "@/data/basics-content";
import { BasicsDialog } from "./basics-dialog";
import { PrmPreview, RehearsePreview } from "./basics-previews";

const ICONS = { prm: Handshake, rehearse: AudioLines } as const;

// Featured product: decorative preview, icon + name, headline, description and
// a CTA pinned to the bottom. With no real product URL, the CTA opens an
// overview dialog stating "Product link coming soon".
export function ProductCard({ product }: { product: BasicsProduct }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[product.key];
  const titleId = `basics-product-${product.key}-title`;
  const dialogTitleId = `basics-product-${product.key}-dialog-title`;

  return (
    <article className={`bx-product bx-product--${product.key}`} aria-labelledby={titleId}>
      <div className="bx-product__preview" aria-hidden="true">
        <span className="bx-preview-label">{product.previewLabel}</span>
        {product.key === "prm" ? <PrmPreview /> : <RehearsePreview />}
      </div>
      <div className="bx-product__body">
        <p className="bx-product__name">
          <span className="bx-product__icon"><Icon size={20} strokeWidth={1.9} aria-hidden="true" /></span>
          <span id={titleId}>{product.name}</span>
        </p>
        <h3 className="bx-product__headline">{product.headline}</h3>
        <p className="bx-product__desc">{product.description}</p>
        <div className="bx-product__foot">
          {product.href ? (
            <a href={product.href} className="bx-btn bx-btn--primary" target="_blank" rel="noopener noreferrer">
              {product.cta}<span aria-hidden="true">→</span>
            </a>
          ) : (
            <button type="button" className="bx-btn bx-btn--primary" aria-haspopup="dialog" onClick={() => setOpen(true)}>
              {product.cta}<span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>

      {!product.href && (
        <BasicsDialog open={open} onClose={() => setOpen(false)} titleId={dialogTitleId} className={`bx-dialog--${product.key}`}>
          <p className="bx-dialog__kicker">
            <span className="bx-product__icon"><Icon size={18} strokeWidth={1.9} aria-hidden="true" /></span>
            Product overview
          </p>
          <h2 id={dialogTitleId} className="bx-dialog__title">{product.name}</h2>
          <p className="bx-dialog__lead">{product.headline}</p>
          <p className="bx-dialog__text">{product.description}</p>
          <div className="bx-dialog__preview" aria-hidden="true">
            <span className="bx-preview-label">{product.previewLabel}</span>
            {product.key === "prm" ? <PrmPreview /> : <RehearsePreview />}
          </div>
          <p className="bx-status"><span className="bx-status__dot" aria-hidden="true" />{PRODUCT_LINK_PENDING}</p>
          <div className="bx-dialog__actions">
            <button type="button" className="bx-btn bx-btn--secondary" onClick={() => setOpen(false)}>Close</button>
          </div>
        </BasicsDialog>
      )}
    </article>
  );
}
