import { faqs } from "@/content/faqs";
import { site } from "@/content/site";

/** Everything you need to come along, on the homepage. */
export function Attend() {
  return (
    <section className="at s6" id="attend" aria-labelledby="at-title">
      <div className="wrap">
        <header className="s6__head">
          <p className="s6__eyebrow">Attend</p>
          <h2 id="at-title" className="s6__title">The day, at a glance.</h2>
        </header>
        <div className="at__grid">
          <dl className="at__facts">
            <div>
              <dt>Date</dt>
              <dd>
                {site.date.label} <span className="at__tbc">(to be confirmed)</span>
              </dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>
                {site.venue.name}
                <br />
                {site.venue.address}
              </dd>
            </div>
            <div>
              <dt>Who</dt>
              <dd>Around 150 students from schools across Singapore</dd>
            </div>
            <div id="register">
              <dt>Register</dt>
              <dd>
                Registration opens soon. Follow{" "}
                <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                  @econs_expo on Instagram
                </a>{" "}
                to hear first.
              </dd>
            </div>
          </dl>
          <div className="at__faq">
            <h3 className="pa__h3">Questions</h3>
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
