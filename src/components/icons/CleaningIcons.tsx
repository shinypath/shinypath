// Icon color: #283D8F (Navy blue from pets icon)
const ICON_COLOR = "#283D8F";

export function FridgeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={ICON_COLOR}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="8" y1="6" x2="8" y2="8" />
      <line x1="8" y1="14" x2="8" y2="18" />
    </svg>
  );
}

export function OvenIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={ICON_COLOR}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <rect x="5" y="10" width="14" height="8" rx="1" />
      <circle cx="7" cy="7" r="1" />
      <circle cx="12" cy="7" r="1" />
      <circle cx="17" cy="7" r="1" />
    </svg>
  );
}

export function CabinetsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={ICON_COLOR}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="8" y1="8" x2="8" y2="12" />
      <line x1="16" y1="8" x2="16" y2="12" />
    </svg>
  );
}

export function DishesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={ICON_COLOR}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="16" rx="9" ry="4" />
      <ellipse cx="12" cy="14" rx="9" ry="4" />
      <path d="M3 14v2c0 2.21 4.03 4 9 4s9-1.79 9-4v-2" />
      <circle cx="12" cy="8" r="5" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  );
}

export function PetsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 47 47"
      fill="none"
      className={className}
    >
      <g clipPath="url(#pets-clip)">
        <path
          stroke={ICON_COLOR}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M23.385 35.078v4.385m2.923-7.307-2.923 2.923-2.923-2.923M19 8.77h8.77m-8.77 0L9.204 5.891a1.462 1.462 0 0 0-1.79 1.15l-3 16.076C4.13 24.622 6.057 25.492 7 24.29L19 8.77Zm8.77 0 9.798-2.879a1.462 1.462 0 0 1 1.79 1.15l3 16.076c.281 1.504-1.644 2.375-2.587 1.173L27.769 8.77Z"
        />
        <path
          fill={ICON_COLOR}
          d="M16.808 27.771a2.192 2.192 0 1 0 0-4.384 2.192 2.192 0 0 0 0 4.384Zm13.154 0a2.192 2.192 0 1 0 0-4.384 2.192 2.192 0 0 0 0 4.384Z"
        />
        <path
          stroke={ICON_COLOR}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M38 21.996V33.62a5.847 5.847 0 0 1-5.846 5.846H14.616A5.846 5.846 0 0 1 8.77 33.62V21.996"
        />
      </g>
      <defs>
        <clipPath id="pets-clip">
          <path fill="#fff" d="M0 0h46.77v46.77H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
