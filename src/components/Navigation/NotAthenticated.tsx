import Link from "next/link";
import React, { FC } from "react";
import { Logo } from "../Logo";

interface Props {}

const NotAuthenticated: FC<Props> = () => {
  const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME;
  return (
    <div className="fixed z-50 bg-white flex items-center justify-center h-16 md:h-20 w-screen shadow-lg shadow-gray-100 px-8">
      <div className="relative aspect-square h-1/2 w-auto mr-3">
        <Logo />
      </div>
      <Link href="/">
        <h1 className="text-xl font-Basic text-primary cursor-pointer">
          {BRAND_NAME}
        </h1>
      </Link>
    </div>
  );
};

export { NotAuthenticated };
