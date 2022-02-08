import { Popover } from "@headlessui/react";
import axios from "axios";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { CgArrowsExchangeAltV, CgCheck } from "react-icons/cg";
import { GoPrimitiveDot } from "react-icons/go";
import { IoLogOut } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { KeyedMutator } from "swr";
import { PreferencesContext } from "../../context/PreferencesContext";
import { UserEntity } from "../../types";

interface Props {
  name?: string;
  walletAddress?: string;
  mutate: KeyedMutator<UserEntity>;
  setIsLogoutOpen: Dispatch<SetStateAction<boolean>>;
}

const EditProfileButton: FC<Props> = ({
  name,
  walletAddress,
  mutate,
  setIsLogoutOpen,
}) => {
  const [nameInput, setNameInput] = useState<string>(name || "");
  const [active, setActive] = useState<string | null>(null);

  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const [firstName] = name?.split(" ")!;

  const shortAddress =
    walletAddress?.substring(0, 5) +
    "..." +
    walletAddress?.substring(walletAddress.length - 5);

  const greeting = `Hi ${firstName}! 👋🏽`;
  const wallet = `wallet is ${shortAddress}`;

  const validUpdateFields = name !== nameInput && nameInput.length > 2;

  const message = !active?.includes("wallet") ? (
    greeting
  ) : (
    <p>
      Your <img src="/metamask.png" width={30} className="inline" /> {wallet}
    </p>
  );

  const handleNameInput = (event: ChangeEvent<HTMLInputElement>) =>
    setNameInput(event.target.value);

  const handleProfileUpdate = async (close: any) => {
    const { data } = await axios.put("/api/users", { name: nameInput });
    mutate(data);
    close();
  };

  const handleLogout = () => setIsLogoutOpen(true);

  // Toggle message every x seconds
  useEffect(() => {
    let number = 0;
    const interval = setInterval(() => {
      if (number % 2) {
        setActive(greeting);
      } else {
        setActive(wallet);
      }
      number += 1;
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Set initial state
  useEffect(() => setActive(greeting), []);

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex flex-row items-center group font-Basic text-base text-primary px-6 pr-4 ml-6 rounded-full hover:bg-primary hover:text-white hover:bg-none hover:text-sm transition-all ease-in-out duration-500 ${
              active?.includes("wallet") ? "py-0.5" : "py-1.5 capitalize"
            }`}
          >
            {message}
            <span
              className={`hidden group-hover:block float-right ml-2 animate-pulse ${
                active?.includes("wallet") && "text-green-600"
              } `}
            >
              {active?.includes("wallet") ? <GoPrimitiveDot /> : <MdEdit />}
            </span>
          </Popover.Button>

          {open && (
            <Popover.Panel className="absolute z-10 right-0 top-10 w-64">
              <div className="flex flex-col w-full bg-white rounded-md py-3 px-4 shadow-lg text-secondary text-sm ">
                <div className="flex flex-col w-full">
                  <p className="font-medium">My name</p>
                  <div className="relative flex flex-row items-center">
                    <input
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="Name"
                      value={nameInput}
                      onChange={handleNameInput}
                      className="relative w-full py-1 md:py-1 pl-3 my-1 md:my-2 text-left rounded-md focus:outline-black border border-tertiary text-secondary"
                    />
                    {validUpdateFields && (
                      <button
                        onClick={() => handleProfileUpdate(close)}
                        className="absolute right-1"
                      >
                        <CgCheck className="text-green-500 text-3xl" />
                      </button>
                    )}
                  </div>

                  <p className="font-medium mt-1">Connected account</p>
                  <div className="relative flex flex-row items-center">
                    <input
                      disabled={true}
                      value={shortAddress}
                      className="relative w-full py-1 md:py-1 pl-3 my-1 md:my-2 text-left rounded-md focus:outline-black border border-tertiary text-secondary"
                    />
                    <button onClick={handleLogout} className="absolute right-1">
                      <IoLogOut className="text-red-600 text-xl opacity-80 hover:text-red-800" />
                    </button>
                  </div>

                  <p className="font-medium mt-1">Currency</p>
                  <div className="relative flex flex-row items-center">
                    <input
                      disabled={true}
                      value={
                        currency === "USD" ? "Dollars (USD)" : "Ethereum (ETH)"
                      }
                      className="relative w-full py-1 md:py-1 pl-3 my-1 md:my-2 text-left rounded-md focus:outline-black border border-tertiary text-secondary"
                    />
                    <div
                      onClick={toggleCurrency}
                      className="flex flex-row bg-green-500 items-center cursor-pointer group"
                    >
                      <span className="absolute right-6 inline-block my-1 py-1">
                        {currency === "USD" ? (
                          "💵"
                        ) : (
                          <img src="/currency/eth.png" className="h-4" />
                        )}
                      </span>
                      <button type="button" className="absolute right-0">
                        <CgArrowsExchangeAltV className="text-2xl text-gray-300 group-hover:text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          )}
        </>
      )}
    </Popover>
  );
};

export { EditProfileButton };
