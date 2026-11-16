"use client";

import { useId, useState } from "react";

const CURRENCY = "USD";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY, maximumFractionDigits: 2 });

type Parsed = { value: number | null; error: string | null };

function parse(raw: string, { max, label }: { max?: number; label: string }): Parsed {
  const text = raw.trim().replace(/,/g, "");
  if (!text) return { value: null, error: null };
  if (!/^\d*\.?\d+$|^\d+\.$/.test(text)) return { value: null, error: `Enter ${label} as a number.` };
  const value = Number(text);
  if (!Number.isFinite(value)) return { value: null, error: `Enter ${label} as a number.` };
  if (max !== undefined && value > max) return { value: null, error: `Enter ${label} between 0 and ${max}.` };
  return { value, error: null };
}

// Optional local calculator inside the "Commission calculator" preview:
// commission = deal value × rate / 100. Nothing is sent anywhere.
export function CommissionCalculator() {
  const id = useId();
  const [deal, setDeal] = useState("");
  const [rate, setRate] = useState("");
  const dealParsed = parse(deal, { label: "a deal value of 0 or more" });
  const rateParsed = parse(rate, { max: 100, label: "a rate" });
  const ready = dealParsed.value !== null && rateParsed.value !== null;
  const commission = ready ? (dealParsed.value! * rateParsed.value!) / 100 : null;

  return (
    <form className="bx-calc" onSubmit={(event) => event.preventDefault()} noValidate aria-label="Commission calculator">
      <div className="bx-field">
        <label htmlFor={`${id}-deal`}>Deal value ({CURRENCY})</label>
        <div className="bx-input-wrap">
          <span className="bx-input-affix" aria-hidden="true">$</span>
          <input
            id={`${id}-deal`} inputMode="decimal" autoComplete="off" value={deal} placeholder="10,000"
            onChange={(event) => setDeal(event.target.value)}
            aria-invalid={dealParsed.error ? true : undefined}
            aria-describedby={dealParsed.error ? `${id}-deal-error` : undefined}
          />
        </div>
        {dealParsed.error && <p id={`${id}-deal-error`} className="bx-field__error">{dealParsed.error}</p>}
      </div>
      <div className="bx-field">
        <label htmlFor={`${id}-rate`}>Commission rate (%)</label>
        <div className="bx-input-wrap">
          <input
            id={`${id}-rate`} inputMode="decimal" autoComplete="off" value={rate} placeholder="15"
            onChange={(event) => setRate(event.target.value)}
            aria-invalid={rateParsed.error ? true : undefined}
            aria-describedby={rateParsed.error ? `${id}-rate-error` : undefined}
          />
          <span className="bx-input-affix" aria-hidden="true">%</span>
        </div>
        {rateParsed.error && <p id={`${id}-rate-error`} className="bx-field__error">{rateParsed.error}</p>}
      </div>
      <div className="bx-calc__result" aria-live="polite">
        <span className="bx-calc__result-label">Estimated commission ({CURRENCY})</span>
        <output className="bx-calc__result-value" htmlFor={`${id}-deal ${id}-rate`}>
          {commission !== null ? money.format(commission) : "—"}
        </output>
        {commission === null && <span className="bx-calc__hint">{dealParsed.error || rateParsed.error ? "Fix the highlighted value to see an estimate." : "Enter a deal value and a rate to see an estimate."}</span>}
      </div>
    </form>
  );
}
