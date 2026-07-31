type LogoProps = {
  withWordmark?: boolean;
  size?: number;
  className?: string;
};

/**
 * ClipDrop mark: a droplet silhouette with a play-triangle notch,
 * reading as "clip" (film/play) merged with "drop" (download).
 * Flat, single-color, works at favicon size.
 */
export function Logo({ withWordmark = true, size = 28, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 2C16 2 6 14.2 6 20.5C6 26 10.477 30 16 30C21.523 30 26 26 26 20.5C26 14.2 16 2 16 2Z"
          className="fill-accent"
        />
        <path d="M13.5 14.5L21 19L13.5 23.5V14.5Z" className="fill-surface" />
      </svg>
      {withWordmark && (
        <span className="text-lg font-bold tracking-tight text-text-primary">
          ClipDrop
        </span>
      )}
    </span>
  );
}
