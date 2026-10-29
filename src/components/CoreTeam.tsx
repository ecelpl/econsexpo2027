"use client";

import Link from "next/link";
import { Photo } from "@/components/Photo";
import { Portrait, ProfileProvider } from "@/components/People";
import { coreTeam, members } from "@/content/team";

export function CoreTeam() {
  return (
    <ProfileProvider>
      <section className="core" aria-labelledby="core-title">
        <div className="wrap core__grid">
          <div className="core__lead">
            <p className="eyebrow">The people</p>
            <h2 id="core-title" className="display">
              Run by students, <br />
              <span className="hand core__hand">start to finish.</span>
            </h2>
            <p className="core__body">
              {members.length} students across a core team and three subcommittees are planning every question, briefing
              and crisis. Tap a face to meet them.
            </p>
            <Link href="/team/" className="btn btn--line">
              Meet the whole team
            </Link>
          </div>

          <figure className="core__group">
            <Photo slug="core-2027" alt="The Econs Expo 2027 core team standing together in the SJI International courtyard" sizes="(max-width: 860px) 100vw, 52vw" pos="50% 62%" />
            <figcaption className="hand">the 2027 core team, August 2026</figcaption>
          </figure>

          <ul className="core__strip" aria-label="Core team">
            {coreTeam.map((m, i) => (
              <li key={m.slug} style={{ ["--i" as string]: i }}>
                <Portrait member={m} size="md" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ProfileProvider>
  );
}
