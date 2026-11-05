import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { experiences, site } from "@/content/site";
import { faqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "Attend",
  description: "Date, venue, who can come and how to register interest for Econs Expo 2027.",
};


export default function AttendPage() {
  return (
    <div className="attend paper-grid">
      <section className="wrap attend__head" aria-labelledby="attend-title">
        <p className="eyebrow">Attend</p>
        <h1 id="attend-title" className="display display--xl">
          The day, <span className="hand attend__hand">at a glance.</span>
        </h1>
      </section>

      <section className="wrap attend__grid" aria-label="Key details">
        <dl className="attend__facts">
          <div>
            <dt>Date</dt>
            <dd>
              {site.date.label} <span className="tbc">to be confirmed</span>
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
          <div>
            <dt>Experiences</dt>
            <dd>
              <ul>
                {experiences.map((x) => (
                  <li key={x.id}>{x.title}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
        <figure className="attend__photo">
          <Photo slug="hall-wide" alt="The 2026 conference hall full of students at round tables" sizes="(max-width: 860px) 100vw, 45vw" />
          <figcaption className="hand">the hall in 2026</figcaption>
        </figure>
      </section>

      <section id="register" className="wrap attend__register" aria-labelledby="reg-title">
        <h2 id="reg-title" className="display">Register interest</h2>
        <p>
          Registration opens soon. Follow{" "}
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            @econs_expo on Instagram
          </a>{" "}
          to hear first.
        </p>
      </section>

      <section className="wrap attend__faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="eyebrow">Questions</h2>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
        <p className="attend__back">
          <Link href="/">Back to the homepage</Link>
        </p>
      </section>
    </div>
  );
}
