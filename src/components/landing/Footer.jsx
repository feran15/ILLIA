import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>

          <span className="font-display font-bold text-foreground">
            IlliaAi
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          © 2026 IlliaAi. Built for African creators. 🌍
        </p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy
          </a>

          <a href="#" className="transition-colors hover:text-foreground">
            Terms
          </a>

          <a href="#" className="transition-colors hover:text-foreground">
            Support
          </a>
        </div>

      </div>
    </footer>
  );
}