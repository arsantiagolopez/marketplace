import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { AnimatedFox } from "../AnimatedFox";
import { ConnectMetamask } from "../ConnectMetamask";

interface Props {}

const SignIn: FC<Props> = () => {
  const [isMetamaskConnected, setIsMetamaskConnected] =
    useState<boolean>(false);
  const [isConnectingMetamask, setIsConnectingMetamask] =
    useState<boolean>(false);
  const [metamaskError, setMetamaskError] = useState<string | null>(null);

  const router = useRouter();

  const metamaskButtonText = metamaskError
    ? metamaskError
    : isConnectingMetamask
    ? "Signing in ..."
    : isMetamaskConnected
    ? "Welcome back 👋🏽"
    : "Sign in with MetaMask";

  const connectMetamaskProps = {
    setIsConnected: setIsMetamaskConnected,
    isConnectingMetamask,
    setIsConnectingMetamask,
    metamaskError,
    setMetamaskError,
  };

  useEffect(() => {
    if (isMetamaskConnected) {
      setTimeout(() => {
        router.push("/explore");
      }, 1000);
    }
  }, [isMetamaskConnected]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] w-full text-center ${
        isMetamaskConnected &&
        "opacity-0 transition-opacity duration-1500 ease-in-out"
      }`}
    >
      <div className="w-fit h-52">
        <AnimatedFox />
      </div>

      <h1 className="font-Basic text-2xl tracking-tight mb-2">
        You know the drill
      </h1>

      <ConnectMetamask
        ButtonComponent={
          <button
            disabled={isConnectingMetamask}
            className="flex flex-row items-center justify-center font-Basic rounded-full bg-primary px-8 py-3 my-6 text-white w-auto hover:animate-pulse hover:bg-black"
          >
            <span className={`${metamaskError && "animate-pulse"}`}>
              {metamaskButtonText}
            </span>
          </button>
        }
        {...connectMetamaskProps}
      />
    </div>
  );
};

export { SignIn };
