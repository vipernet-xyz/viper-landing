import FooterBottom from "../components/FooterBottom";
import FooterCTA from "../components/FooterCTA";
import FooterLinks from "../components/FooterLinks";

export default function Footer() {
  return (
    <footer className="relative mx-auto mt-56 overflow-x-clip">
      {/* Layer 1: Outermost vibrant purple ambient glow */}
      <div className="absolute inset-x-0 -top-64 h-[600px] w-[170%] -left-[35%] bg-[radial-gradient(ellipse_at_center,_#7E5CFF_0%,_#6B47FF_20%,_transparent_70%)] opacity-60 blur-[120px] rounded-[50%]"></div>

      {/* Layer 2: Strong purple glow */}
      <div className="absolute inset-x-0 -top-56 h-[500px] w-[160%] -left-[30%] bg-[radial-gradient(ellipse_at_center,_#8E6FFF_0%,_#7E5CFF_30%,_transparent_70%)] opacity-70 blur-[80px] rounded-[50%]"></div>

      {/* Layer 3: Purple to white-purple transition */}
      <div className="absolute inset-x-0 -top-48 h-[400px] w-[150%] -left-[25%] bg-[radial-gradient(ellipse_at_center,_#B8A6FF_0%,_#9B7FFF_40%,_transparent_70%)] opacity-80 blur-[60px] rounded-[50%]"></div>

      {/* Layer 4: Bright white-purple inner glow */}
      <div className="absolute inset-x-0 -top-44 h-[350px] w-[130%] -left-[15%] bg-[radial-gradient(ellipse_at_center,_#E0D9FF_0%,_#C8B6FF_50%,_transparent_70%)] opacity-90 blur-[40px] rounded-[50%]"></div>

      {/* Layer 5: White core glow */}
      <div className="absolute inset-x-0 -top-40 h-[340px] w-[130%] -left-[15%] bg-[radial-gradient(ellipse_at_center,_white_0%,_#F0EBFF_40%,_transparent_60%)] opacity-80 blur-[30px] rounded-t-[50%_30%] lg:rounded-t-[50%_100%]"></div>

      {/* Layer 6: Sharp white border glow */}
      <div className="absolute inset-x-0 -top-36 h-[320px] w-[127%] -left-[13.5%] bg-white opacity-50 blur-[15px] rounded-t-[50%_30%] lg:rounded-t-[50%_100%]"></div>

      {/* Black arc (main element) */}
      <div className="absolute inset-x-0 -top-32 h-[1000px] w-[200%] -left-1/2 bg-black rounded-t-[50%_30%] lg:rounded-t-[50%_100%] shadow-[0_0_120px_rgba(255,255,255,0.3)]"></div>
      {/* Content */}
      <div className="relative z-10 mx-auto overflow-clip bg-black">
        <div className="max-w-7xl mx-auto">
          <FooterCTA />
          <FooterLinks />
          <FooterBottom />
          <div
            className="h-12 lg:h-24 w-full bg-black mt-12 "
            style={{
              background: "url('/assets/footer/viper-network.svg')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center bottom",
              backgroundSize: "contain",
            }}
          />
        </div>
      </div>
    </footer>
  );
}
