import Link from "next/link";

/** Logo ILSEBEAUTY : le monogramme B dans l'en-tête, le logo complet là où il y a de la place. */
export function Logo({ variant = "monogram" }: { variant?: "monogram" | "full" }) {
  const full = variant === "full";
  return (
    <Link className="logo-link" href="/" aria-label="ILSEBEAUTY, home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={full ? "logo-full" : "logo-mono"}
        src={full ? "/brand/ilsebeauty-logo.png" : "/brand/ilsebeauty-monogram.png"}
        width={full ? 239 : 173}
        height={full ? 342 : 273}
        alt="ILSEBEAUTY"
      />
    </Link>
  );
}
