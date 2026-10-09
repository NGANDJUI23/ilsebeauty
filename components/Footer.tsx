import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="f-grid">
          <div style={{ display: "grid", gap: "var(--s2)" }}>
            <Logo variant="full" />
            <p>Lash extensions, lifts and brows, by appointment.</p>
          </div>
          <div>
            <h4>Visit</h4>
            <ul>
              <li><Link href="/services">Our services</Link></li>
              <li><Link href="/book">Book an appointment</Link></li>
              <li><Link href="/manage">Manage bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4>Hours</h4>
            <ul>
              <li>Mon – Fri · 09:00 – 19:00</li>
              <li>Saturday · 09:00 – 17:00</li>
              <li>Sunday · Closed</li>
            </ul>
          </div>
          <div>
            <h4>Bookings</h4>
            <p>All appointments are booked and managed securely through Fresha.</p>
          </div>
        </div>
        <div className="copy">
          <span>© {new Date().getFullYear()} ILSEBEAUTY. All rights reserved.</span>
          <span>Website content and photography may not be reused without permission.</span>
        </div>
      </div>
    </footer>
  );
}
