import { Listbox, Transition } from "@headlessui/react";
import React, { Dispatch, FC, Fragment, SetStateAction } from "react";
import { CgCheck } from "react-icons/cg";
import { HiSelector } from "react-icons/hi";

interface Props {
  isSeller: boolean | null;
  setIsSeller: Dispatch<SetStateAction<boolean | null>>;
}

const SellerSelect: FC<Props> = ({ isSeller, setIsSeller }) => {
  const types = [
    { name: "Buyer", value: false },
    { name: "Seller", value: true },
  ];

  const typeName = isSeller === null ? "..." : isSeller ? "Seller" : "Buyer";

  return (
    <div className="form-field flex flex-col justify-between items-start">
      <Listbox value={isSeller} onChange={setIsSeller}>
        {({ open }) => (
          <>
            <h1
              className={`font-Basic ${
                isSeller === null
                  ? "text-4xl md:text-5xl tracking-tighter mb-3 md:mb-6"
                  : "text-3xl tracking-tight"
              }`}
            >
              I would like to be a...
            </h1>
            <div className="relative flex flex-col md:flex-auto w-full md:w-full md:flex-row justify-between font-Basic text-2xl md:text-base my-2 md:my-4">
              <Listbox.Button className="relative w-full py-2 md:py-3 pl-3 my-2 md:my-0 bg-white text-left rounded-lg shadow-md cursor-cursor focus:outline-none">
                <span className="block truncate">{typeName}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  {isSeller === null || open ? (
                    <HiSelector
                      className="w-5 h-5 text-gray-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <CgCheck className="absolute text-green-500 text-3xl right-1" />
                  )}
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute left-0 top-16 md:top-12 md:right-0 w-full overflow-auto text-lg md:text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {types.map(({ name, value }) => (
                    <Listbox.Option
                      key={name}
                      value={value}
                      className={({ active }) =>
                        `${active ? "text-white bg-primary" : "text-gray-900"}
                    px-3 cursor-pointer select-none relative py-1 md:py-1`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className="block truncate">{name}</span>
                          {selected && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <CgCheck className="w-5 h-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export { SellerSelect };
