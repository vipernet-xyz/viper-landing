export default function FeaturesBullets() {
  return (
    <div className="flex justify-between gap-8 w-full items-stretch flex-col  lg:gap-12">
      <div className="flex-1 flex flex-col">
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-white mb-4 font-lato">Connect</h3>
          <p className="text-white/80 font-lato">
            Point your app to Viper's RPC endpoint.
          </p>
        </div>
        <div className="w-full h-1 bg-gradient-to-r to-[#473782] from-[#BCAFEB] mt-4" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-white mb-4 font-lato">Query</h3>
          <p className="text-white/80 font-lato">
            We route your requests to the best-performing nodes.
          </p>
        </div>
        <div className="w-full h-1 bg-gradient-to-r to-[#473782] from-[#BCAFEB] mt-4" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-white mb-4 font-lato">Scale</h3>
          <p className="text-white/80 font-lato">
            Get guaranteed uptime & fast response at 3x cheaper.
          </p>
        </div>
        <div className="w-full h-1 bg-gradient-to-r to-[#473782] from-[#BCAFEB] mt-4" />
      </div>
    </div>
  )
}
