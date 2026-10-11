/** Séparation courbe entre deux sections : `from` est la couleur au-dessus, `to` celle en dessous. */
const PATHS = {
  a: "M0,62 C220,8 470,6 720,44 C980,84 1210,92 1440,34 L1440,96 L0,96 Z",
  b: "M0,30 C260,88 520,92 760,52 C1010,10 1230,6 1440,58 L1440,96 L0,96 Z"
};

export function Wave({ from, to, variant = "a", className = "" }: { from: string; to: string; variant?: keyof typeof PATHS; className?: string }) {
  return (
    <div className={"wave " + className} aria-hidden="true" style={{ background: from }}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" focusable="false">
        <path d={PATHS[variant]} fill={to} />
      </svg>
    </div>
  );
}
