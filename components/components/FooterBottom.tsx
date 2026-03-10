import Image from "next/image";

export default function () {
  return (
    <div className="flex flex-col items-center md:flex-row justify-between md:items-baseline mt-8">
      <div className="items-center space-x-2 mb-4 md:mb-0 hidden md:flex">
        <div className="scale-75 md:scale-100">
          <Image
            src="/assets/logo.png"
            height={41}
            width={42}
            alt="vipernet logo"
            className="h-auto w-[60px]"
          />
        </div>
      </div>

      <p className="text-white font-space-grotesk font-bold">
        © 2025 Viper Network Inc. All Rights Reserved
      </p>
    </div>
  );
}
