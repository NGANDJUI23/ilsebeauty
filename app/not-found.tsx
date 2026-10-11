import Link from "next/link";

export default function NotFound() {
  return (
    <section className="view wrap sec">
      <span className="eyebrow">404</span>
      <h1 className="h2" style={{ margin: "var(--s1) 0 var(--s3)" }}>this page doesn&apos;t exist</h1>
      <Link className="btn" href="/">Back to home</Link>
    </section>
  );
}
