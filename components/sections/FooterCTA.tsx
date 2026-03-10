import Link from "next/link";
import { Button } from "../ui/button";

export default function FooterCTA() {
  return (
    <div className="text-center mb-20">
      <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 font-inter">
        Your Network
      </h2>
      <h2 className="text-5xl lg:text-7xl font-bold text-white/90 mb-12 font-inter">
        Needs You.
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center px-8">
        <Button
          asChild
          size="lg"
          className="w-36 cursor-pointer border border-white bg-white font-space-grotesk text-base font-medium text-black hover:bg-white/80"
        >
          <Link href="/login">Launch App</Link>
        </Button>
        <Link href={'https://discord.com/invite/eBDYH4Zxek'}  target="_blank">

        <Button
          size="lg"
          variant="outline"
          className=" hover:bg-[#D1D1D1]/20 hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-base w-36 cursor-pointer"
        >
          Join Us
        </Button>
        </Link>
      </div>
    </div>
  );
}
