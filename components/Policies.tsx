/** Règles du salon : utilisées sur /policies et /manage. */
export const POLICIES: [string, string][] = [
  ["Deposit", "A deposit secures new full sets and is taken off your final bill."],
  ["24-hour notice", "Change or cancel at least 24 hours ahead to keep your deposit."],
  ["Patch test", "New clients with sensitive eyes can book a free patch test 48 hours before."],
  ["Fills", "Fills need at least 40% of your lashes still in place, otherwise we book a full set."],
  ["Come prepared", "Arrive with clean lashes, no mascara, and contact lenses out."],
  ["Aftercare", "Keep lashes dry for 24 hours and brush them gently each morning."]
];

export function PolicyList() {
  return (
    <ul className="policy">
      {POLICIES.map(([t, d]) => (
        <li key={t}><b>{t}</b><span>{d}</span></li>
      ))}
    </ul>
  );
}
