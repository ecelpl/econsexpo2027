export function Speakers() {
  return (
    <section className="spk" id="speakers" aria-labelledby="spk-title">
      <div className="wrap spk__grid">
        <div>
          <p className="eyebrow">Guest speakers 2027</p>
          <h2 id="spk-title" className="display">
            To be <span className="hand spk__hand">announced.</span>
          </h2>
          <p className="spk__body">
            We are inviting economists and people from finance and policy to open the day. Names go up here once they are
            confirmed, not before.
          </p>
        </div>
        <ul className="spk__cards" aria-label="Speaker places, not yet announced">
          {[1, 2, 3].map((n) => (
            <li key={n} className="spk__card">
              <span className="spk__slot tabular">0{n}</span>
              <span className="spk__line" />
              <span className="spk__line spk__line--short" />
              <span className="hand spk__tba">name to come</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
