import Link from "next/link";

export default function FooterLinks() {
  return (
    <div className="flex gap-12 py-12 lg:py-24 px-4">
      <div className="font-bold text-white font-space-grotesk">
        <h3 className="text-xl mb-2">+ Resources:</h3>
        <div className="space-y-2">
          <div>
          <Link href={"https://medium.com/@vipernet"} target="_blank">
            Blogs
          </Link>
          </div>
          <div>
          <Link href={"https://docs.vipernet.xyz/"} target="_blank">
            Doc
          </Link>
          </div>
        </div>
      </div>

      <div className="font-bold text-white font-space-grotesk">
        <h3 className="text-xl mb-2">+ Community:</h3>
        <div className="space-y-2">
          <div>
            <Link href={"https://x.com/viper_network_"} target="_blank">
              X [Twitter]
            </Link>
          </div>
          <div>
            <Link href={"https://github.com/vipernet-xyz"} target="_blank">
              Github
            </Link>
          </div>
          <div>
            <Link
              href={"https://discord.com/invite/eBDYH4Zxek"}
              target="_blank"
            >
              Discord
            </Link>
          </div>
          <div>
            <Link href={"https://medium.com/@vipernet"} target="_blank">
              Medium
            </Link>
          </div>
          <div>
            <Link href={"mailto:contact@vipernet.xyz"} target="_blank">
              Mail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
