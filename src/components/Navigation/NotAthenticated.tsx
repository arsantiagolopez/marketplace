import React, { FC } from "react";
import { Logo } from "../Logo";

interface Props {}

const NotAuthenticated: FC<Props> = () => (
  <div className="fixed z-50 bg-white flex items-center justify-center h-16 md:h-20 w-screen shadow-lg shadow-gray-100 px-6">
    <div className="relative aspect-square h-1/2 w-auto mr-3">
      <Logo />
    </div>
    <h1 className="text-xl font-Basic text-primary">Tri Payments</h1>
  </div>
);

export { NotAuthenticated };
