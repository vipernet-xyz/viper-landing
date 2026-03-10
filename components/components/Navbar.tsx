import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "https://docs.vipernet.xyz/", label: "Docs" },
  { href: "https://medium.com/@vipernet", label: "Blog" },
  { href: "mailto:contact@vipernet.xyz", label: "Contact" },
];

export default function Navbar() {
  return (
    <nav className="fixed left-1/2 top-0 z-50 w-full max-w-7xl -translate-x-1/2 px-3 py-4 md:px-4 md:py-6">
      <div className="glass-effect rounded-full px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              height={41}
              width={42}
              alt="Viper Network logo"
              className="h-auto w-10"
            />
            <span className="hidden text-sm font-medium uppercase tracking-[0.2em] text-white/70 sm:block">
              Viper Network
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                className="text-sm font-inter text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className={cn(
                "border-white/20 bg-white/5 px-4 text-white hover:bg-white/10 hover:text-white",
                "font-space-grotesk"
              )}
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className={cn(
                "border border-white bg-white px-4 text-black hover:bg-white/80",
                "font-space-grotesk"
              )}
            >
              <Link href="/login">Launch App</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
