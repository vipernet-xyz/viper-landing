import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="fixed left-1/2 z-50 w-full max-w-7xl -translate-x-1/2 px-2 py-4 lg:px-4 lg:py-8">
      <div className="glass-effect px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between">
          <Image
            src="/assets/logo.png"
            height={40}
            width={40}
            alt="Viper Network logo"
            className="h-auto w-10"
          />

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-32 md:flex">
            <Link
              href="https://docs.vipernet.xyz/"
              className="font-inter text-lg text-white transition-colors hover:text-white/80"
              target="_blank"
            >
              Docs
            </Link>
            <Link
              href="https://medium.com/@vipernet"
              className="font-inter text-lg text-white transition-colors hover:text-white/80"
              target="_blank"
            >
              Blogs
            </Link>
            <Link
              href="mailto:contact@vipernet.xyz"
              className="font-inter text-lg text-white transition-colors hover:text-white/80"
            >
              Contact
            </Link>
          </div>

          <Link href="https://tally.so/r/wdrzdd" target="_blank">
            <Button
              size="lg"
              className="w-28 cursor-pointer border border-white bg-white font-space-grotesk text-sm font-medium text-black hover:border-white hover:bg-[#9c7ff162] hover:text-white md:text-base"
            >
              Join Waitlist
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
