// Decorative HTML/CSS previews for JazzHQ Basics. No real product screenshots
// exist in the repo, so these are deliberately abstract (skeleton bars, no
// data, nothing focusable) and always rendered with aria-hidden by callers.

import type { BasicsResource } from "@/data/basics-resources";

const Bar = ({ w, tone = "" }: { w: string; tone?: string }) => <span className={`bxp-bar ${tone}`} style={{ width: w }} />;

/** JazzHQ PRM: partner rows, lead pipeline and commissions, green accents. */
export function PrmPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`bxp-frame bxp-frame--prm${compact ? " is-compact" : ""}`}>
      <div className="bxp-frame__top"><i /><i /><i /></div>
      <div className="bxp-prm">
        <div className="bxp-panel bxp-prm__partners">
          <span className="bxp-panel__title">Partners</span>
          {["72%", "58%", "66%", "50%"].slice(0, compact ? 3 : 4).map((w, i) => (
            <div className="bxp-row" key={w + i}>
              <span className="bxp-avatar" />
              <Bar w={w} />
              <span className={`bxp-pill${i === 1 ? " is-muted" : ""}`} />
            </div>
          ))}
        </div>
        <div className="bxp-prm__side">
          <div className="bxp-panel">
            <span className="bxp-panel__title">Lead pipeline</span>
            <div className="bxp-pipeline">
              {[3, 2, 1].map((n, col) => (
                <div className="bxp-pipeline__col" key={col}>
                  {Array.from({ length: n }, (_, i) => <span key={i} className={`bxp-chip${col === 2 ? " is-won" : ""}`} />)}
                </div>
              ))}
            </div>
          </div>
          {!compact && (
            <div className="bxp-panel">
              <span className="bxp-panel__title">Commissions</span>
              <div className="bxp-bars">
                {[38, 52, 44, 68, 60, 82].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const WAVE = [22, 40, 64, 38, 80, 56, 30, 70, 92, 60, 36, 52, 76, 44, 28, 58, 84, 48, 32, 62, 40, 24];

/** RehearseHQ: practice scenario, audio waveform and feedback panel, purple accents. */
export function RehearsePreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`bxp-frame bxp-frame--rehearse${compact ? " is-compact" : ""}`}>
      <div className="bxp-frame__top"><i /><i /><i /></div>
      <div className="bxp-rh">
        <div className="bxp-panel bxp-rh__scenario">
          <span className="bxp-panel__title">Practice scenario</span>
          <Bar w="86%" tone="is-strong" />
          <Bar w="64%" />
          <div className="bxp-wave">
            {WAVE.slice(0, compact ? 16 : WAVE.length).map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
          </div>
        </div>
        {!compact && (
          <div className="bxp-panel bxp-rh__feedback">
            <span className="bxp-panel__title">Feedback</span>
            {["78%", "62%", "70%"].map((w, i) => (
              <div className="bxp-row" key={i}>
                <span className="bxp-tick" />
                <Bar w={w} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Template tile for the homepage banner composition. */
export function TemplatePreview() {
  return (
    <div className="bxp-frame bxp-frame--template is-compact">
      <div className="bxp-template">
        <span className="bxp-panel__title">Template</span>
        {["80%", "64%", "72%", "52%"].map((w, i) => (
          <div className="bxp-row" key={i}>
            <span className={`bxp-check${i < 2 ? " is-done" : ""}`} />
            <Bar w={w} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Thumbnail / dialog illustration for a resource card. */
export function ResourcePreview({ kind, large = false }: { kind: BasicsResource["preview"]; large?: boolean }) {
  const cls = `bxp-res bxp-res--${kind}${large ? " is-large" : ""}`;
  switch (kind) {
    case "checklist":
      return (
        <div className={cls}>
          <div className="bxp-sheet">
            {["78%", "62%", "70%", "54%", "66%"].slice(0, large ? 5 : 4).map((w, i) => (
              <div className="bxp-row" key={i}><span className={`bxp-check${i < 2 ? " is-done" : ""}`} /><Bar w={w} /></div>
            ))}
          </div>
        </div>
      );
    case "planner":
      return (
        <div className={cls}>
          <div className="bxp-sheet bxp-planner">
            {Array.from({ length: large ? 4 : 3 }, (_, r) => (
              <div className="bxp-planner__row" key={r}>
                <Bar w="70%" />
                {[0, 1, 2, 3].map((c) => <span key={c} className={`bxp-cell${(r + c) % 3 === 0 ? " is-on" : ""}`} />)}
              </div>
            ))}
          </div>
        </div>
      );
    case "calculator":
      return (
        <div className={cls}>
          <div className="bxp-sheet bxp-calc">
            <div className="bxp-calc__field"><Bar w="40%" /><span className="bxp-input" /></div>
            <div className="bxp-calc__field"><Bar w="34%" /><span className="bxp-input" /></div>
            <div className="bxp-calc__result"><Bar w="46%" tone="is-strong" /></div>
          </div>
        </div>
      );
    case "meeting":
      return (
        <div className={cls}>
          <div className="bxp-sheet">
            {["84%", "60%", "72%", "48%"].slice(0, large ? 4 : 3).map((w, i) => (
              <div className="bxp-row" key={i}><span className="bxp-num">{i + 1}</span><Bar w={w} /></div>
            ))}
          </div>
        </div>
      );
    case "guide":
    case "conversation":
      return (
        <div className={cls}>
          <div className="bxp-sheet bxp-doc">
            <Bar w="58%" tone="is-strong" />
            <Bar w="92%" /><Bar w="84%" /><Bar w="88%" />
            {large && <><Bar w="40%" tone="is-strong" /><Bar w="90%" /><Bar w="76%" /></>}
          </div>
        </div>
      );
  }
}
