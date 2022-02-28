import { Dialog, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { Dispatch, FC, Fragment, SetStateAction } from "react";
import { IoCloseSharp, IoMenuSharp } from "react-icons/io5";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  isProfileCompleted: boolean;
  isSeller?: boolean;
}

const MobileMenu: FC<Props> = ({
  isMenuOpen,
  setIsMenuOpen,
  isProfileCompleted,
  isSeller,
}) => {
  const handleSignOut = () => signOut();

  // @todo
  return (
    <>
      {isMenuOpen ? (
        <IoCloseSharp className="z-50" />
      ) : (
        <IoMenuSharp className="z-50" />
      )}

      <Transition appear show={isMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="z-40 fixed inset-0 overflow-y-auto backdrop-blur-3xl shadow-2xl"
          onClose={() => setIsMenuOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-5" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="z-50 flex flex-col items-start w-full p-4 pt-28 text-left transition-all transform font-Basic text-3xl leading-loose text-secondary">
                <Link href="/explore">
                  <button className="tracking-tight">Explore</button>
                </Link>
                <Link href="/tokens">
                  <button className="tracking-tight">My tokens</button>
                </Link>

                {isProfileCompleted ? (
                  <>
                    {isSeller ? (
                      <Link href="/dashboard">
                        <button className="tracking-tight">
                          Seller dashboard
                        </button>
                      </Link>
                    ) : (
                      <Link href="/register">
                        <button className="tracking-tight">
                          Become a seller
                        </button>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link href="/register">
                    <button className="tracking-tight">
                      Complete your profile
                    </button>
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="text-red-700 tracking-tight"
                >
                  Log out
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export { MobileMenu };
