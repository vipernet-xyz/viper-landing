import FooterBottom from "../components/FooterBottom";
import FooterCTA from "../components/FooterCTA";
import FooterLinks from "../components/FooterLinks";

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto">
      <FooterCTA />
      <FooterLinks />
      <FooterBottom />
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-bold text-white font-space-grotesk leading-none">
          Viper Network
        </h1>
      </div>
    </footer>
  );
}
