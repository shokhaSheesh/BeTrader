/** Brand loader: a lime arc spinning on an ink disc (the app icon's colors). No text; the label is for screen readers. */
export function Loader({ size = 40, label = 'Loading' }: { size?: number; label?: string }) {
  return (
    <span
      role="status"
      className="inline-grid shrink-0 place-items-center rounded-full bg-inverse"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
        style={{ width: size * 0.62, height: size * 0.62 }}
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="3"
          className="text-on-inverse opacity-15"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-accent"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  )
}
