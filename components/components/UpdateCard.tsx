import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

interface UpdateCardPropsI {
  update: {
    image: string;
    date: string;
    title: string;
    link: string;
  };
}

export default function UpdateCard({ update }: UpdateCardPropsI) {
  return (
    <Card className="bg-black border-white/70 border-[0.6px] rounded-none overflow-hidden relative">
      <div className="px-8 pt-8 pb-4">
        <div className="relative h-48 border-white/70 border-[0.6px]">
          <Image
            src={update.image}
            alt={update.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <CardContent className="px-8">
        <p className="text-white/50 text-sm font-space-grotesk mb-3">
          {update.date}
        </p>
        <h3 className="text-white text-lg font-space-grotesk h-32 leading-tight">
          {update.title}
        </h3>
        <Image
          src={"/assets/read-more/bottom-line.svg"}
          alt={update.title}
          width={292}
          height={44}
          className="w-[87.5%] absolute bottom-12"
        />
        <div className="pt-6">
          <Link href={update.link} target="_blank">
          <Button
            variant="outline"
            className="text-white hover:bg-white/10 font-space-grotesk p-0 h-auto text-sm border border-white/20 px-10 py-3 cursor-pointer"
          >
            Read More
          </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
