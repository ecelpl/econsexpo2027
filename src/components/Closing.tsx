import Link from "next/link";
import { Loop } from "@/components/Loop";
import { site, registerHref } from "@/content/site";

export function Closing() {
  return (
    <section className="close" aria-labelledby="close-title">
      <svg className="close__edge" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 L0 30 C 240 30, 300 0, 520 0 L 920 0 C 1140 0, 1200 30, 1440 30 L1440 60 Z" />
      </svg>
      <div className="wrap close__grid">
        <div className="close__copy">
          <p className="eyebrow eyebrow--light">Econs Expo {site.edition}</p>
          <h2 id="close-title" className="close__title">
            Your <span className="hand close__hand">move.</span>
          </h2>
          <p className="close__body">
            {site.date.label} <span className="tbc tbc--light">date to be confirmed</span>
            <br />
            {site.venue.name}, {site.venue.address}
          </p>
          <div className="close__ctas">
            <Link href={registerHref} className="btn btn--paper">
              Register interest
            </Link>
            <Link href="/attend/" className="btn btn--line-light">
              How the day works
            </Link>
          </div>
        </div>
        <figure className="close__window">
          <Loop slug="team" label="A team at their table during Econs Expo 2026" />
          <figcaption className="hand">2026 · this could be your table</figcaption>
        </figure>
      </div>
    </section>
  );
}
