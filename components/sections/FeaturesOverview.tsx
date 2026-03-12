"use client";

import Link from "next/link";
import { GitBranch, Network, CircuitBoard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturesOverview() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative min-h-[340px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-80 w-80">
                <CircuitBoard className="absolute h-80 w-80 text-white/10" />
                <Network className="absolute left-10 top-10 h-60 w-60 text-white/20" />
                <GitBranch className="absolute left-20 top-20 h-40 w-40 text-white/15" />
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="gradient-purple flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/20">
                <Network className="h-16 w-16 text-white" />
              </div>
            </div>

            <div className="absolute left-1/4 top-1/2 h-0.5 w-16 -translate-y-1/2 bg-white/30" />
            <div className="absolute right-1/4 top-1/2 h-0.5 w-16 -translate-y-1/2 bg-white/30" />
            <div className="absolute left-1/2 top-1/4 h-16 w-0.5 -translate-x-1/2 bg-white/30" />
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="mb-4 font-lato text-2xl font-bold text-white">Connect</h3>
              <p className="font-lato text-white/80">
                Point your app to Viper&apos;s RPC endpoint.
              </p>
              <div className="mt-4 h-1 w-32 bg-white/20" />
            </div>

            <div>
              <h3 className="mb-4 font-lato text-2xl font-bold text-white">Query</h3>
              <p className="font-lato text-white/80">
                We route your requests to the best-performing nodes.
              </p>
              <div className="mt-4 h-1 w-32 bg-white/20" />
            </div>

            <div>
              <h3 className="mb-4 font-lato text-2xl font-bold text-white">Scale</h3>
              <p className="font-lato text-white/80">
                Get guaranteed uptime and fast response at a fraction of the cost.
              </p>
              <div className="mt-4 h-1 w-32 bg-white/20" />
            </div>

            <Button asChild variant="link" className="p-0 font-space-grotesk text-white underline">
              <Link href="https://docs.vipernet.xyz/" target="_blank">
                View Docs To Know More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
