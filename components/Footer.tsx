import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t py-3 sm:py-6 bg-background/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Routine Check. All rights reserved.
        </p>

        <nav>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms & Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
