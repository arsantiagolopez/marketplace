import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import React, { Dispatch, FC, Fragment, SetStateAction } from "react";
import { CgCheck } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";

interface Props {
  /* Is dialog open or closed */
  isOpen: boolean;
  /* Open or close dialog */
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  /* Success, failure, or null */
  type?: string;
  /* Title to display on dialog */
  title?: string;
  /* Helper message */
  message?: string;
  /* Custom action buttons */
  ActionControl?: JSX.Element;
}

const Dialog: FC<Props> = ({
  isOpen,
  setIsOpen,
  type,
  title,
  message,
  ActionControl,
}) => (
  <Transition appear show={isOpen} as={Fragment}>
    <HeadlessDialog
      as="div"
      className="z-50 fixed inset-0 overflow-y-auto backdrop-blur-3xl shadow-2xl"
      onClose={() => setIsOpen(false)}
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
          <HeadlessDialog.Overlay className="fixed inset-0 bg-black opacity-5" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-md p-6 pb-10 md:p-10 md:pt-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            {type === "success" ? (
              <CgCheck className="text-6xl text-green-500 mx-auto animate-[ping_0.5s_ease-out_1]" />
            ) : type === "failure" ? (
              <IoCloseSharp className="text-4xl my-3 text-red-500 mx-auto animate-[ping_0.5s_ease-out_1]" />
            ) : null}

            <HeadlessDialog.Title
              as="h3"
              className="font-Basic text-2xl md:text-3xl laeding-tight md:leading-normal tracking-tight text-primary"
            >
              {title}
            </HeadlessDialog.Title>

            <p className="text-base leading-snug text-gray-500 my-3">
              {message}
            </p>

            {ActionControl}
          </div>
        </Transition.Child>
      </div>
    </HeadlessDialog>
  </Transition>
);

export { Dialog };
