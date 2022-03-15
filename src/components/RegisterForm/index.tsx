import axios from "axios";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { CgCheck } from "react-icons/cg";
import { IoArrowForward } from "react-icons/io5";
import { RiLoader4Line } from "react-icons/ri";
import { createSeller } from "../../blockchain/Marketplace";
import { UserSession } from "../../types";
import { CompletedCheck } from "../CompletedCheck";
import { ConnectMetamask } from "../ConnectMetamask";
import { Dialog } from "../Dialog";
import { BuyerFields } from "./BuyerFields";
import { SellerFields } from "./SellerFields";
import { SellerSelect } from "./SellerSelect";

interface FormData {
  store?: string;
  name: string;
}

interface Props {
  session?: UserSession;
}

const RegisterForm: FC<Props> = ({ session }) => {
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [isSeller, setIsSeller] = useState<boolean | null>(null);
  const [isMetamaskConnected, setIsMetamaskConnected] =
    useState<boolean>(false);
  const [isConnectingMetamask, setIsConnectingMetamask] =
    useState<boolean>(false);
  const [metamaskError, setMetamaskError] = useState<string | null>(null);
  const [isRegistration, setIsRegistration] = useState<boolean>(true);

  const { handleSubmit, register, watch } = useForm<FormData>();

  const router = useRouter();

  const { user } = session || {};

  // Loading is false when user is missing required fields
  const validStoreField = !!(isSeller
    ? watch("store") && watch("store")!.length > 2
    : null);
  const validNameField = !!(watch("name") && watch("name").length > 2);

  const fieldsCompleted = isSeller
    ? validStoreField && validNameField
    : validNameField;

  const isCompleted = isMetamaskConnected && fieldsCompleted;
  const isProfileCompleted = !(!user?.name && user?.walletAddress);

  const nextButtonText = isCompleted
    ? "Looks good. Continue"
    : !isMetamaskConnected && fieldsCompleted
    ? "Lastly, connect a test wallet"
    : "Some fields missing";

  const metamaskButtonText = metamaskError
    ? metamaskError
    : isConnectingMetamask
    ? "Connecting ..."
    : isMetamaskConnected
    ? "Connected"
    : isProfileCompleted
    ? "Connect with MetaMask"
    : "Confirm your wallet";

  // Handle submit
  const onSubmit = async ({ store, name }: FormData) => {
    if (user) {
      if (store) {
        // If not registered, register seller on the smart contract
        try {
          const success = await createSeller();

          if (!success) {
            return setOnSuccess(false);
          }

          // Create seller profile
          await axios.post("/api/sellers", {
            name: store,
            image: process.env.NEXT_PUBLIC_DEFAULT_STORE_IMAGE,
            address: user.walletAddress,
          });
        } catch {
          console.log("Seller could not be registered.");
        }
      }

      try {
        // Update user
        const { status } = await axios.put("/api/users/", {
          name,
          isSeller: !!store,
        });

        if (status !== 200) {
          return setOnSuccess(false);
        }

        setOnSuccess(true);
      } catch {
        console.log("User account could not be created.");
      }
    }
  };

  // Form fields registration
  const nameRegister: UseFormRegisterReturn = register("name", {
    required: "What's your name?",
  });
  const storeRegister: UseFormRegisterReturn | null = isSeller
    ? register("store", {
        required: "What do you wanna call your store?",
      })
    : null;

  // Redirect on success
  useEffect(() => {
    if (onSuccess) {
      // Reload session by replicating a different tab click
      const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
      };

      reloadSession();

      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [onSuccess]);

  // Complete profile flag. It's a registration, until it's not
  useEffect(() => setIsRegistration(!(!user?.name && user?.walletAddress)), []);

  const selectProps = { isSeller, setIsSeller };
  const sellerProps = {
    storeRegister,
    nameRegister,
    validStoreField,
    validNameField,
  };
  const buyerProps = { nameRegister, validNameField };
  const connectMetamaskProps = {
    setIsConnected: setIsMetamaskConnected,
    isConnectingMetamask,
    setIsConnectingMetamask,
    metamaskError,
    setMetamaskError,
  };
  const successDialogProps = {
    isOpen: onSuccess,
    setIsOpen: setOnSuccess,
    isCentered: true,
    type: "success",
    title: `${
      isRegistration ? "Account successfully created" : "Profile completed"
    }`,
    message: `${
      isRegistration
        ? `Your ${
            isSeller ? "seller" : "buyer"
          } account was successfully created. You can start buying ${
            isSeller ? "and selling " : ""
          }items on the ${process.env.NEXT_PUBLIC_BRAND_NAME}`
        : "Your profile was successfully completed."
    }`,
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] pt-16 md:pt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col flex-grow px-6 md:px-[35%] transition-all ${
          isSeller === null
            ? "pt-48 md:pt-40"
            : isSeller
            ? "py-14 md:py-14"
            : "py-14 md:py-20"
        }`}
      >
        <SellerSelect {...selectProps} />
        {isSeller === null ? null : isSeller ? (
          <SellerFields {...sellerProps} />
        ) : (
          <BuyerFields {...buyerProps} />
        )}
        {isSeller !== null && (
          <>
            <ConnectMetamask
              ButtonComponent={
                <button
                  disabled={isConnectingMetamask}
                  className="flex flex-row items-center justify-center font-Basic rounded-full bg-primary px-4 pr-6 py-1.5 mt-10 mb-6 md:mb-4 text-white w-full"
                >
                  {!metamaskError && (
                    <img
                      src="/metamask.png"
                      width="35"
                      className={`mr-3 ${
                        isConnectingMetamask && "ml-[-1.25em]"
                      }`}
                    />
                  )}
                  <span
                    className={`${metamaskError && "animate-pulse py-1.5"}`}
                  >
                    {metamaskButtonText}
                  </span>
                  {isMetamaskConnected && !isConnectingMetamask && (
                    <CgCheck className="text-2xl ml-2 pointer-events-none text-green-500" />
                  )}
                </button>
              }
              {...connectMetamaskProps}
            />
            <button
              type="submit"
              disabled={!isCompleted}
              className={`flex justify-center font-Basic items-center rounded-full text-white py-3 px-6 pr-4 w-auto ${
                isCompleted ? "bg-primary hover:bg-black" : "bg-gray-600"
              }`}
            >
              {nextButtonText}
              <CompletedCheck
                isCompleted={isCompleted}
                CustomCheck={
                  <IoArrowForward className="text-lg ml-3 mr-1 pointer-events-none text-white" />
                }
                CustomSpinner={
                  <RiLoader4Line className="text-xl ml-3 mr-1 pointer-events-none text-white animate-spin-slow" />
                }
              />
            </button>
          </>
        )}
      </form>

      {/* Show dialog on success */}
      <Dialog {...successDialogProps} />
    </div>
  );
};

export { RegisterForm };
