import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full border-t py-6 mt-auto">
      <div className="container flex items-center justify-between">
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
