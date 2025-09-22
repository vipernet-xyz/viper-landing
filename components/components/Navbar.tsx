import Image from "next/image"
import { Button } from "../ui/button"

export default function Navbar() {
  return      (
    <nav className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8">
    <div className="glass-effect px-8 py-4">
      <div className="flex items-center justify-between">

        <Image
          src="assets/logo.svg"
          height={40}
          width={40}
          alt="vipernet logo"
          />

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-32 items-center">
          <a href="#" className="text-white hover:text-white/80 transition-colors font-inter text-lg">
            Docs
          </a>
          <a href="#" className="text-white hover:text-white/80 transition-colors font-inter text-lg">
            Blogs
          </a>
          <a href="#" className="text-white hover:text-white/80 transition-colors font-inter text-lg">
            Contact
          </a>
        </div>

        <Button className="bg-white text-black hover:bg-white/90 font-space-grotesk font-medium">
          Get Started
        </Button>
      </div>
    </div>
  </nav>)
}
