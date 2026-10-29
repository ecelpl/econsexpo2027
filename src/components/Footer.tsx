import Link from "next/link";
import { site, registerHref } from "@/content/site";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__grid">
        <div>
          <p className="foot__word">Econs Expo</p>
          <p className="foot__sub">
            A student-led inter-school economics conference, hosted by {site.venue.name}.
          </p>
        </div>
        <div>
          <h2 className="eyebrow">Where</h2>
          <p>
            {site.venue.name}
            <br />
            {site.venue.address}
          </p>
        </div>
        <div>
          <h2 className="eyebrow">Explore</h2>
          <ul className="foot__list">
            <li><Link href="/#experiences">Experiences</Link></li>
            <li><Link href="/team/">Meet the team</Link></li>
            <li><Link href="/2026/">Econs Expo 2026</Link></li>
            <li><Link href="/attend/">Attend</Link></li>
            <li><Link href={registerHref}>Register interest</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="eyebrow">Follow</h2>
          <ul className="foot__list">
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                Instagram @econs_expo
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap foot__base">
        <span>© 2026 Econs Expo, SJI International</span>
        <span className="hand">made by students, for students</span>
      </div>
    </footer>
  );
}
