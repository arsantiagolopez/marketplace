import { Dialog, Transition } from "@headlessui/react";
import React, {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CgCheck } from "react-icons/cg";
import { RiLoader4Line } from "react-icons/ri";

interface Props {
  isLocked: boolean;
  setIsLocked: Dispatch<SetStateAction<boolean>>;
}

const LockScreen: FC<Props> = ({ isLocked, setIsLocked }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const handleClose = () => {
    setIsVisible(false);
    setIsReady(false);
    setIsLocked(false);
  };

  useEffect(() => {
    // Show check icon before closing modal
    if (isVisible && !isLocked) {
      setIsReady(true);
      setTimeout(() => setIsVisible(isLocked), 2000);
    }
    // Show initial loading spinner
    if (!isVisible && isLocked) {
      setIsReady(false);
      setIsVisible(true);
    }
  }, [isLocked]);

  return (
    <Transition appear show={isVisible} as={Fragment}>
      <Dialog
        as="div"
        className="z-50 fixed inset-0 overflow-y-auto backdrop-blur-lg shadow-2xl"
        onClose={handleClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-5" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
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
            <div className="inline-block w-full">
              {!isReady ? (
                <RiLoader4Line className="text-6xl text-primary animate-spin-slow mx-auto" />
              ) : (
                <CgCheck className="text-6xl text-green-500 animate-[ping_0.5s_ease-out_1] mx-auto" />
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export { LockScreen };
