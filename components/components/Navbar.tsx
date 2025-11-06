import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="z-50 w-full max-w-7xl px-2 py-4 lg:px-4 lg:py-8 fixed left-1/2 -translate-x-1/2">
      <div className="glass-effect px-4 lg:px-8 py-2 lg:py-4">
        <div className="flex items-center justify-between">
          <Image
            src="/assets/logo.png"
            height={40}
            width={40}
            alt="vipernet logo"
          />

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-32 items-center">
            <Link
              href="https://docs.vipernet.xyz/"
              className="text-white hover:text-white/80 transition-colors font-inter text-lg"
              target="_blank"
            >
              Docs
            </Link>
            <Link
              href="https://medium.com/@vipernet"
              className="text-white hover:text-white/80 transition-colors font-inter text-lg"
              target="_blank"
            >
              Blogs
            </Link>
            <Link
              href="mailto:contact@vipernet.xyz"
              className="text-white hover:text-white/80 transition-colors font-inter text-lg"
            >
              Contact
            </Link>
          </div>

          <Button className="bg-white text-black hover:bg-[#9c7ff162] hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-xs lg:text-base cursor-pointer">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
