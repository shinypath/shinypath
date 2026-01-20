export function FridgeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
      stroke="currentColor"
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
      stroke="currentColor"
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
      stroke="currentColor"
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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="4" cy="8" r="2" />
      <circle cx="8" cy="15" r="2" />
      <circle cx="14" cy="15" r="2" />
      <path d="M7 15c0 2.5 2 5 5 5s5-2.5 5-5" />
    </svg>
  );
}
