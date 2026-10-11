/** Illustrations « polaroid » dessinées en SVG, tons chauds. */
export type ArtKind = "classic" | "volume" | "wet" | "tray" | "brow";

const SKINS: [string, string][] = [
  ["#e9c9b0", "#c99a7c"],
  ["#d7a98a", "#a8735a"],
  ["#c48d6c", "#8a5a43"],
  ["#efd5c0", "#d4a98d"],
  ["#b57c5d", "#7b4d39"]
];

function Tray() {
  const rows: React.ReactNode[] = [];
  for (let r = 0; r < 5; r++) {
    const y = 36 + r * 32;
    rows.push(<line key={`l${r}`} x1="22" y1={y + 10} x2="178" y2={y + 10} stroke="#d8c2a4" strokeWidth="1" />);
    for (let i = 0; i < 14; i++) {
      const x = 28 + i * 11;
      const h = 10 + ((i * 7 + r * 3) % 5) * 2;
      rows.push(<path key={`p${r}-${i}`} d={`M${x} ${y + 10} q2 -${h / 2} 5 -${h}`} stroke="#241f21" strokeWidth="1.1" fill="none" strokeLinecap="round" />);
    }
  }
  return (
    <svg viewBox="0 0 200 200" role="presentation">
      <rect width="200" height="200" fill="#f1e6da" />
      {rows}
      <rect x="150" y="160" width="26" height="14" fill="#a35257" opacity=".85" />
    </svg>
  );
}

export function LashArt({ kind, seed }: { kind: ArtKind; seed: number }) {
  if (kind === "tray") return <Tray />;

  const [a, b] = SKINS[seed % SKINS.length];
  const gid = `lash-g${seed}`;
  const cx = 100, cy = kind === "brow" ? 118 : 104, w = kind === "brow" ? 70 : 78;
  const n = kind === "volume" ? 46 : kind === "wet" ? 20 : 32;
  const len = kind === "volume" ? 34 : kind === "wet" ? 38 : 28;
  const sw = kind === "wet" ? 2.2 : kind === "volume" ? 0.9 : 1.3;

  const lashes: React.ReactNode[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) * (1 - t) * (cx - w) + 2 * (1 - t) * t * cx + t * t * (cx + w);
    const y = (1 - t) * (1 - t) * cy + 2 * (1 - t) * t * (cy + 38) + t * t * cy;
    const ang = Math.PI / 2 + (t - 0.55) * 1.3;
    const L = len * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15)));
    const ex = x + Math.cos(ang) * L * 0.35 + (t - 0.5) * 16;
    const ey = y + Math.sin(ang) * L;
    lashes.push(
      <path
        key={i}
        d={`M${x.toFixed(1)} ${y.toFixed(1)} Q${((x + ex) / 2 + 6).toFixed(1)} ${((y + ey) / 2).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
        stroke="#241f21"
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  const brow: React.ReactNode[] = [];
  if (kind === "brow") {
    for (let i = 0; i < 40; i++) {
      const x = 50 + i * 2.6, y = 60 - Math.sin((i / 40) * Math.PI) * 12;
      brow.push(<line key={i} x1={x.toFixed(1)} y1={(y + 6).toFixed(1)} x2={(x + 5).toFixed(1)} y2={(y - 4).toFixed(1)} stroke="#3a2a22" strokeWidth="1.2" strokeLinecap="round" />);
    }
  }

  return (
    <svg viewBox="0 0 200 200" role="presentation">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gid})`} />
      {/* paupière fermée */}
      <path d={`M${cx - w} ${cy} Q${cx} ${cy + 38} ${cx + w} ${cy}`} stroke="#5b3a2c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d={`M${cx - w + 6} ${cy - 22} Q${cx} ${cy - 44} ${cx + w - 4} ${cy - 18}`} stroke="#7b4d39" strokeWidth="1" fill="none" opacity=".45" />
      {lashes}
      {brow}
      <circle cx={cx + w - 6} cy={cy - 30} r="3" fill="#f1d8d3" opacity=".8" />
    </svg>
  );
}
