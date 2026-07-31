type ErrorCardProps = {
  message: string;
};

export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-error bg-error-soft p-4"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="mt-0.5 flex-none text-error"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
      <p className="text-sm font-medium text-text-primary">{message}</p>
    </div>
  );
}
