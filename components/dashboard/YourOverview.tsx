'use client'

export function YourOverview() {
    return (
        <div 
            className="relative overflow-hidden rounded-[10px] min-h-[199px] bg-black"
            style={{
                backgroundImage: 'url(/assets/backgrounds/overview-bg.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="relative p-6">
                <h3 className="text-white text-[15px] font-normal mb-6">Your Overview</h3>
                
                <div className="p-6 rounded-[10px] bg-[rgba(37,37,37,0.5)] backdrop-blur-sm">
                    <div className="text-xl font-normal text-white mb-2 font-['Space_Grotesk']">70.7K</div>
                    <div className="text-[11px] text-white/70 font-normal">Total Relays Sent</div>
                </div>
            </div>
        </div>
    )
}