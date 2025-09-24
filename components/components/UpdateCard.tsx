import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import Image from "next/image"

interface UpdateCardPropsI {
  update: {
    image: string
    date: string
    title: string
  }
}

export default function UpdateCard({ update }: UpdateCardPropsI) {
  return (
    <Card className="bg-black border-white/70 border-[0.6px] rounded-none overflow-hidden">
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
        <div className="border-t border-white/20 pt-6">
          <Button variant="link" className="text-white font-space-grotesk p-0 h-auto text-sm border border-white/20 px-10 py-3">
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
