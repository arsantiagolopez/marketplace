import { Disclosure, RadioGroup, Transition } from "@headlessui/react";
import Link from "next/link";
import React, { Dispatch, FC, SetStateAction } from "react";
import { CgCheck } from "react-icons/cg";
import { GoCheck } from "react-icons/go";
import { ItemEntity } from "../../types";
import { Tooltip } from "../Tooltip";

interface Props {
  items?: ItemEntity[];
  selectItemIds: string[] | null;
  setSelectItemIds: Dispatch<SetStateAction<string[] | null>>;
}

const ItemsSelect: FC<Props> = ({ items, selectItemIds, setSelectItemIds }) => {
  const isOpen = selectItemIds !== null;

  const handleSelectItem = (id: string) => {
    if (selectItemIds && !selectItemIds.includes(id)) {
      setSelectItemIds([...selectItemIds, id]);
    } else if (selectItemIds && selectItemIds.includes(id)) {
      const withoutSelected = selectItemIds.filter((item) => item !== id);
      setSelectItemIds(withoutSelected);
    }
  };

  const handleSelectAll = () => setSelectItemIds(null);

  return (
    <div className="flex flex-col items-start w-full">
      <Disclosure>
        {/* Title */}
        <div className="flex flex-row items-baseline justify-between w-full">
          <h1 className="relative title flex flex-row items-baseline">
            Extras.{" "}
            <Tooltip label="Choose what items to allow buyers to pair up with this listing.">
              <div className="flex justify-center items-center text-white bg-primary italic text-[9pt] rounded-full h-4 w-4 ml-2 pr-1">
                i
              </div>
            </Tooltip>
          </h1>
          <RadioGroup
            value={selectItemIds}
            onChange={setSelectItemIds}
            className="flex flex-row text-primary text-lg md:text-md tracking-tight cursor-pointer"
          >
            {/* Open disclosure on Select click */}
            <Disclosure.Button>
              <RadioGroup.Option value={[]}>
                <div className="flex flex-row items-center font-Basic text-md">
                  Select
                  <div className="flex items-center rounded-md border-2 h-5 w-5 border-primary mx-2">
                    {isOpen && <GoCheck />}
                  </div>
                </div>
              </RadioGroup.Option>
            </Disclosure.Button>
            <RadioGroup.Option onClick={handleSelectAll} value={null}>
              {({ checked }) => (
                <div className="flex flex-row items-center font-Basic text-md ml-2">
                  All
                  <div className="flex items-center rounded-md border-2 h-5 w-5 border-primary mx-2">
                    {checked && <GoCheck />}
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>

        {/* Content */}
        <Transition
          show={isOpen}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel className="w-full">
            <div
              className={`w-full overflow-scroll max-h-[60vh] ${
                items ? "grid grid-cols-3 gap-3 py-4" : "pt-4"
              }`}
            >
              {items ? (
                items.map(({ id, image }) => (
                  <div
                    key={id}
                    onClick={() => handleSelectItem(id)}
                    className="relative flex justify-center items-center rounded-lg aspect-square w-full cursor-pointer shadow-lg hover:opacity-90 overflow-hidden"
                  >
                    <img
                      src={image}
                      className={`h-full w-full object-cover ${
                        selectItemIds?.includes(id) && "brightness-[30%]"
                      }`}
                    />
                    {selectItemIds?.includes(id) && (
                      <CgCheck className="z-10 absolute text-white text-7xl pointer-events-none animate-pulse" />
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full">
                  <p className="text-tertiary w-full">
                    You haven't created any items yet.{" "}
                    <Link href="/items/create">
                      <span className="cursor-pointer hover:underline">
                        Create one here
                      </span>
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
    </div>
  );
};

export { ItemsSelect };
