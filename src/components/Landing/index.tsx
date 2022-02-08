import Link from "next/link";
import React, { FC } from "react";
import { BrandsTransition } from "../BrandsTransition";

interface Props {}

const Landing: FC<Props> = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col md:flex-row items-start md:justify-center flex-wrap">
        <div className="relative flex flex-row items-baseline mr-3">
          <h1 className="text-4xl md:text-4xl font-Basic tracking-tight mr-44 md:mr-60">
            Buy your
          </h1>
          <BrandsTransition />
          <h1 className="text-4xl md:text-4xl font-Basic tracking-tight">.</h1>
        </div>

        <h1 className="text-4xl md:text-4xl font-Basic tracking-tight mr-3">
          Pay with crypto.
        </h1>
        <h1 className="text-4xl md:text-4xl font-Basic tracking-tight">
          Skip the line.
        </h1>
        <div className="flex flex-col items-center w-full md:justify-center">
          <Link href="/register">
            <a className="button my-6 mb-3 self-start md:self-center ">
              Get Started
            </a>
          </Link>
          <Link href="/signin">
            <a className="font-Basic tracking-tight text-xl self-start md:self-center pl-2 md:pl-0">
              or Sign in
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export { Landing };
