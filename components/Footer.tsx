const LINKS = [
  "About",
  "Contact",
  "Privacy Policy",
  "Terms of Service",
  "FAQ",
  "Supported Platforms",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-8">
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              {label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-text-secondary">© {new Date().getFullYear()} ClipDrop</p>
      </div>
    </footer>
  );
}
