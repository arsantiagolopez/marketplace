import Link from "next/link";
import React, { FC, useState } from "react";
import { IoCloseSharp, IoMenuSharp } from "react-icons/io5";
import useSWR from "swr";
import { Logo } from "../Logo";
import { LogoutAlert } from "../LogoutAlert";
import { EditProfileButton } from "./EditProfileButton";

interface Props {}

const Authenticated: FC<Props> = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { data: user, mutate } = useSWR("/api/users");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { name, walletAddress, isSeller } = user || {};

  const editProfileButtonProps = {
    name,
    walletAddress,
    mutate,
    setIsLogoutOpen,
  };
  const logoutAlertProps = { isOpen: isLogoutOpen, setIsOpen: setIsLogoutOpen };

  return (
    <div className="fixed z-50 bg-white flex items-center justify-between h-16 md:h-20 w-screen shadow-lg shadow-gray-100 px-6">
      {/* Left */}
      <div className="flex flex-row h-full items-center">
        <>
          <div className="relative aspect-square h-1/2 w-auto mr-3">
            <Logo />
          </div>
          <h1 className="text-xl font-Basic text-primary">Tri Payments</h1>
        </>
        <div className="mx-10">
          <Link href="/explore">
            <button className="font-Basic text-primary mx-4">Explore</button>
          </Link>
          <Link href="/how">
            <button className="font-Basic text-primary mx-4">
              How it works
            </button>
          </Link>
          <Link href="/items">
            <button className="font-Basic text-primary mx-4">My items</button>
          </Link>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-row ml-auto">
        {/* Mobile only menu */}
        <button onClick={toggleMenu} className="md:hidden text-3xl">
          {isMenuOpen ? <IoCloseSharp /> : <IoMenuSharp />}
        </button>

        <div className="hidden md:flex flex-row h-full items-center mx-6">
          {!user ? (
            <div className="animate-pulse flex items-center space-x-6">
              <div className="h-5 w-28 bg-slate-300 rounded"></div>
              <div className="h-8 w-36 bg-slate-300 rounded-full"></div>
            </div>
          ) : (
            <>
              <EditProfileButton {...editProfileButtonProps} />
              {isSeller && (
                <Link href="/dashboard">
                  <button className="font-Basic text-sm text-white bg-primary px-6 py-1.5 ml-2 rounded-full hover:bg-secondary">
                    Seller dashboard
                  </button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutAlert {...logoutAlertProps} />
    </div>
  );
};

export { Authenticated };
