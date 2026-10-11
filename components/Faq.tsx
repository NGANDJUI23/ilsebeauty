/** Questions fréquentes : utilisées sur /faq et /manage. */
export const FAQ: [string, string][] = [
  ["I didn't get a confirmation. Is my booking made?", "Your booking is only confirmed when Fresha emails or texts you. If nothing arrived within a few minutes, check your spam folder, then sign in to Fresha to see if it's listed."],
  ["Can I change the service I booked?", "Yes. In Fresha, open the appointment and choose reschedule, or cancel and book again. If the new service is longer we'll need a slot that fits it."],
  ["How long does a full set last?", "Most clients come back for a fill every two to three weeks, as natural lashes shed and take extensions with them."],
  ["Do I need a Fresha account?", "Fresha asks for your name, email and phone when you book. You can sign in later with the same details to manage your appointments."]
];

export function FaqList() {
  return (
    <div className="faq">
      {FAQ.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
