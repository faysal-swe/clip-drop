import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = ["Home", "About", "Contact"];

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <a href="/" aria-label="ClipDrop home">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((label, i) => (
            <a
              key={label}
              href="#"
              className={
                i === 0
                  ? "text-sm font-semibold text-text-primary"
                  : "text-sm font-medium text-text-secondary hover:text-text-primary"
              }
            >
              {label}
            </a>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
