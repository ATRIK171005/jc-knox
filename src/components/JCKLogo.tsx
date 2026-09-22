/**
 * JCK wordmark — geometric, thick rectangular strokes,
 * matching the reference image (J with flat top bar + bottom-left radius,
 * C as a hook, K as two close verticals with diagonal cuts).
 * Colour prop defaults to #1e1e1e for light mode.
 */
export default function JCKLogo({
  color = "#1e1e1e",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="JC Knox"
    >
      {/* J — flat top bar, vertical stem, bottom-left radius */}
      <rect x="28" y="6" width="26" height="11" rx="0" fill={color} />
      <rect x="37" y="6" width="11" height="46" rx="0" fill={color} />
      <path
        d="M18 42 Q18 58 37 58 L48 58 L48 47 L37 47 Q29 47 29 42 Z"
        fill={color}
      />

      {/* C — mirrored J (hook shape, open on the right) */}
      <rect x="58" y="6" width="26" height="11" rx="0" fill={color} />
      <rect x="58" y="6" width="11" height="52" rx="0" fill={color} />
      <rect x="58" y="47" width="26" height="11" rx="0" fill={color} />

      {/* K — left vertical + two diagonals meeting at centre */}
      <rect x="94" y="6" width="11" height="52" rx="0" fill={color} />
      {/* top-right diagonal */}
      <polygon
        points="105,6 120,6 138,32 120,32 105,32"
        fill={color}
      />
      {/* bottom-right diagonal */}
      <polygon
        points="105,36 120,36 142,58 124,58"
        fill={color}
      />
    </svg>
  );
}
