import { BASICS_COPY, BASICS_UPDATES_SIGNUP } from "@/data/basics-content";

// Information only: no working newsletter or notification integration exists,
// so there is no email field and no simulated success message.
export function ComingNext() {
  const copy = BASICS_COPY.comingNext;
  return (
    <section className="bx-section bx-section--quiet bx-container" aria-labelledby="basics-coming-next-title">
      <div className="bx-coming">
        <p className="bx-eyebrow bx-eyebrow--muted">{copy.label}</p>
        <h2 id="basics-coming-next-title" className="bx-coming__title">{copy.heading}</h2>
        <p className="bx-coming__desc">{copy.description}</p>
        {BASICS_UPDATES_SIGNUP}
      </div>
    </section>
  );
}
