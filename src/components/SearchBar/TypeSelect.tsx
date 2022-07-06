import { Listbox, Transition } from "@headlessui/react";
import React, { FC } from "react";
import { CgCheck } from "react-icons/cg";
import { IoChevronDownSharp } from "react-icons/io5";

interface Props {
  options: string[];
  selected: string;
  handleSelect: (option: string) => void;
}

const TypeSelect: FC<Props> = ({ options, selected, handleSelect }) => (
  <Listbox value={selected} onChange={handleSelect}>
    {({ open }) => (
      <div className="relative h-full flex items-center">
        <Listbox.Button className="flex justify-between items-center w-40 md:w-48 h-3/6 px-6 capitalize font-Basic text-xl text-secondary border-l-2 border-gray-100">
          {selected.toLowerCase()}
          <IoChevronDownSharp
            className={`transition-transform duration-300 ${
              open ? "transform -rotate-180" : ""
            }`}
          />
        </Listbox.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options className="absolute top-16 md:top-20 left-0 w-full overflow-auto text-base bg-white rounded-t-none rounded-b-md shadow-xl focus:outline-none sm:text-sm">
            {options.map((option, index) => (
              <Listbox.Option key={index} value={option} className="">
                {({ selected }) => (
                  <p
                    className={`flex flex-row justify-between items-center active:bg-gray-200 hover:bg-gray-100 text-sm capitalize cursor-pointer py-3 px-5 font-Basic ${
                      selected ? "text-primary" : "text-tertiary"
                    }`}
                  >
                    {option.toLowerCase()}
                    {selected && <CgCheck className="text-lg" />}
                  </p>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    )}
  </Listbox>
);

export { TypeSelect };
