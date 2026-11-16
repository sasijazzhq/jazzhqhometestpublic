"use client";

import { BASICS_RESOURCE_TYPE_LABEL, BASICS_RESOURCES_ARE_SAMPLES, type BasicsResource } from "@/data/basics-resources";
import { BasicsDialog } from "./basics-dialog";
import { ResourcePreview } from "./basics-previews";
import { CommissionCalculator } from "./commission-calculator";

// Illustrative preview with an explicit availability status. No downloads and
// no claim that the asset exists.
export function ResourcePreviewDialog({ resource, onClose }: { resource: BasicsResource | null; onClose: () => void }) {
  const titleId = "basics-resource-dialog-title";
  return (
    <BasicsDialog open={!!resource} onClose={onClose} titleId={titleId} className="bx-dialog--resource">
      {resource && (
        <>
          <p className="bx-dialog__kicker">
            <span className={`bx-badge bx-badge--${resource.type}`}>{BASICS_RESOURCE_TYPE_LABEL[resource.type]}</span>
            {BASICS_RESOURCES_ARE_SAMPLES && <span className="bx-dialog__sample">Sample preview</span>}
          </p>
          <h2 id={titleId} className="bx-dialog__title">{resource.title}</h2>
          <p className="bx-dialog__text">{resource.description}</p>
          {resource.preview === "calculator" ? (
            <CommissionCalculator />
          ) : (
            <div className={`bx-dialog__preview bx-dialog__preview--${resource.type}`} aria-hidden="true">
              <ResourcePreview kind={resource.preview} large />
            </div>
          )}
          <p className="bx-status"><span className="bx-status__dot" aria-hidden="true" />{resource.availability}</p>
          <div className="bx-dialog__actions">
            <button type="button" className="bx-btn bx-btn--secondary" onClick={onClose}>Close</button>
          </div>
        </>
      )}
    </BasicsDialog>
  );
}
