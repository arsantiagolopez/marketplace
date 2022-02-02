import { Web3Provider } from "@ethersproject/providers";
import axios from "axios";
import { ethers } from "ethers";
import { signIn } from "next-auth/react";
import React, { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { SignInResponse } from "../../types";

interface Props {
  ButtonComponent: JSX.Element;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  isConnectingMetamask: boolean;
  setIsConnectingMetamask: Dispatch<SetStateAction<boolean>>;
  metamaskError: string | null;
  setMetamaskError: Dispatch<SetStateAction<string | null>>;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ApiError {
  code: number;
  message: string;
}

const ConnectMetamask: FC<Props> = ({
  ButtonComponent,
  setIsConnected,
  isConnectingMetamask,
  setIsConnectingMetamask,
  metamaskError,
  setMetamaskError,
}) => {
  const isMounted = useRef(false);

  // Initialise connection attempt
  const handleConnect = () => !metamaskError && setIsConnectingMetamask(true);

  // Detect catch unknown error type with predicates
  const isApiError = (err: any): err is ApiError => err;

  // Trigger authentication pop-up
  const requestAccess = async (provider: Web3Provider): Promise<boolean> => {
    try {
      // Request connected accounts
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      const { data: signature } = await axios.post("/api/auth/signature", {
        walletAddress,
      });

      const rawSignature = await signer.signMessage(signature);

      // Sign in by validating signatures
      const { ok } = (await signIn("credentials", {
        redirect: false,
        walletAddress,
        signature,
        rawSignature,
      })) as unknown as SignInResponse;

      if (ok) return true;
      else return false;
    } catch (err) {
      // Handle common errors
      if (isApiError(err)) {
        // EIP-1193 userRejectedRequest error
        if (err.code === 4001)
          handleErrorMessage("You rejected the request. Please try again");
        // Pending request error
        else if (err.code === -32002)
          handleErrorMessage("Request pending. Check your windows");
        // Default global error
        else handleErrorMessage("Something went wrong. Try again later");
      }
      return false;
    }
  };

  // Login to MetaMask wallet
  const login = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Trigger authentication pop-up
    const success = await requestAccess(provider);

    // Failed login
    if (!success) {
      setIsConnectingMetamask(false);
      setIsConnected(false);
      return;
    } else {
      // Successfully signed in to Metamask
      setIsConnectingMetamask(false);
      setIsConnected(true);
    }
  };

  // Show connection errors for 3 seconds
  const handleErrorMessage = (message: string) => {
    setMetamaskError(message);
    setTimeout(() => setMetamaskError(null), 3000);
  };

  // Attempt connection
  useEffect(() => {
    if (
      isMounted.current &&
      isConnectingMetamask &&
      typeof window !== "undefined"
    ) {
      // No MetaMask extension, install
      if (!window.ethereum) {
        setIsConnected(false);
        handleErrorMessage("Metamask not installed. Please install it");
        return;
      }

      // MetaMask installed, proceed to login
      login();
    } else {
      isMounted.current = true;
    }
  }, [isConnectingMetamask]);

  return <div onClick={handleConnect}>{ButtonComponent}</div>;
};

export { ConnectMetamask };
