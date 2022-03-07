import { Disclosure, Transition } from "@headlessui/react";
import React, { FC } from "react";
import { IoChevronDownSharp } from "react-icons/io5";

interface Props {
  Button: JSX.Element;
  Panel: JSX.Element;
  isDefaultOpen?: boolean;
}

const Dropdown: FC<Props> = ({ Button, Panel, isDefaultOpen }) => (
  <div className="flex flex-col w-full">
    <Disclosure defaultOpen={isDefaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex flex-row justify-between items-center">
            {Button}
            <IoChevronDownSharp
              className={`transition-transform duration-300  ${
                open ? "transform -rotate-180" : ""
              }`}
            />
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel>{Panel}</Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  </div>
);

export { Dropdown };
