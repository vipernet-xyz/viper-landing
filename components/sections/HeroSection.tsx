"use client";

import Link from "next/link";
import { Atom, Blocks, Diamond, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GradientPolygonIcon from "@/components/icons/GradientPolygonIcon";

const navLinks = [
  { href: "https://docs.vipernet.xyz/", label: "Docs" },
  { href: "https://medium.com/@vipernet", label: "Blog" },
  { href: "mailto:contact@vipernet.xyz", label: "Contact" },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0 gradient-purple-radial" />
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <GradientPolygonIcon width={600} height={600} />
      </div>

      <nav className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="glass-effect rounded-2xl px-5 py-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Blocks className="h-8 w-8 text-white" />
              <span className="hidden font-inter text-sm font-medium uppercase tracking-[0.28em] text-white/75 sm:block">
                Viper Network
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  className="font-inter text-base text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="hidden border-white/30 bg-transparent font-space-grotesk text-white hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                asChild
                className="bg-white font-space-grotesk font-medium text-black hover:bg-white/90"
              >
                <Link href="/login">Launch App</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12 pt-6 md:px-6">
        <div className="relative mx-auto w-full max-w-4xl text-center">
          <div className="floating-animation absolute -left-4 top-6 md:-left-16 md:-top-8">
            <Diamond className="h-12 w-12 text-white/25 md:h-16 md:w-16" />
          </div>
          <div
            className="floating-animation absolute -right-2 top-0 md:-right-12 md:-top-12"
            style={{ animationDelay: "2s" }}
          >
            <Atom className="h-14 w-14 text-white/20 md:h-20 md:w-20" />
          </div>
          <div
            className="floating-animation absolute -bottom-4 left-2 md:-bottom-8 md:-left-8"
            style={{ animationDelay: "4s" }}
          >
            <Link2 className="h-10 w-10 text-white/25 md:h-12 md:w-12" />
          </div>
          <div
            className="floating-animation absolute right-6 top-20 hidden md:block"
            style={{ animationDelay: "1s" }}
          >
            <Blocks className="h-14 w-14 text-white/20" />
          </div>
          <div
            className="floating-animation absolute bottom-10 right-10 hidden md:block"
            style={{ animationDelay: "3s" }}
          >
            <Diamond className="h-10 w-10 text-white/25" />
          </div>

          <h1 className="mb-5 font-inter text-5xl font-bold leading-none text-white sm:text-6xl md:mb-6 md:text-8xl">
            Viper Network
          </h1>
          <p className="mb-4 font-space-grotesk text-xl text-white/80 md:text-2xl">
            The Trustless Gateway to Web3.
          </p>
          <p className="mb-10 font-space-grotesk text-sm uppercase tracking-[0.32em] text-white/45 md:text-base">
            Login in seconds. Relay across chains immediately.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white font-space-grotesk font-medium text-black hover:bg-white/90"
            >
              <Link href="/login">Launch App</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent font-space-grotesk text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center px-4 pb-16 md:pb-20">
        <div className="relative h-[240px] w-[240px] md:h-[320px] md:w-[320px]">
          <div className="gradient-purple absolute inset-0 rounded-[2rem] opacity-20 blur-[2px] md:rounded-[2.5rem]" />
          <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 rotate-12 md:rounded-[2.5rem]" />
          <div className="absolute inset-0 rounded-[2rem] border border-white/10 -rotate-6 md:rounded-[2.5rem]" />
          <div className="absolute inset-5 flex items-center justify-center rounded-[1.5rem] bg-black/55 backdrop-blur-sm md:inset-6 md:rounded-[2rem]">
            <Blocks className="h-16 w-16 text-white/60 md:h-20 md:w-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
