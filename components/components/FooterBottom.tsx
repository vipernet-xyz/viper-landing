import Image from "next/image";

export default function () {
  return (
    <div className="flex flex-col items-center md:flex-row justify-between md:items-baseline mt-8">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <Image
          src="/assets/logo.png"
          height={60}
          width={60}
          alt="vipernet logo"
        />
      </div>

      <p className="text-white font-space-grotesk font-bold">
        © 2025 Viper Network Inc. All Rights Reserved
      </p>
    </div>
  );
}
