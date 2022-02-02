import { Disclosure, RadioGroup, Transition } from "@headlessui/react";
import React, { Dispatch, FC, SetStateAction } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { CgCheck } from "react-icons/cg";
import { GoCheck } from "react-icons/go";
import { Tooltip } from "../Tooltip";

const listings: Listing[] = [
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/2607108/pexels-photo-2607108.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 50,
  },
  {
    id: "2",
    image:
      "https://images.pexels.com/photos/2670273/pexels-photo-2670273.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 75,
  },
  {
    id: "3",
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 13,
  },
  {
    id: "4",
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 35,
  },
  {
    id: "5",
    image:
      "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 20,
  },
  {
    id: "6",
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 35,
  },
  {
    id: "7",
    image:
      "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 20,
  },
  {
    id: "8",
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 13,
  },
  {
    id: "9",
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 35,
  },
  {
    id: "10",
    image:
      "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 20,
  },
  {
    id: "11",
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 35,
  },
  {
    id: "12",
    image:
      "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 20,
  },
];

interface Listing {
  id: string;
  image: string;
  price: number;
}

interface Props {
  items: string[] | null;
  setItems: Dispatch<SetStateAction<string[] | null>>;
  itemsRegister: UseFormRegisterReturn;
}

const ItemsSelect: FC<Props> = ({ items, setItems }) => {
  const isOpen = items !== null;

  const handleSelectItem = (id: string) => {
    if (items && !items.includes(id)) {
      setItems([...items, id]);
    } else if (items && items.includes(id)) {
      const withoutSelected = items.filter((item) => item !== id);
      setItems(withoutSelected);
    }
  };

  const handleSelectAll = () => setItems(null);

  return (
    <div className="flex flex-col items-center w-full">
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
            value={items}
            onChange={setItems}
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
          <Disclosure.Panel className="py-4">
            <div className="grid grid-cols-3 gap-3 overflow-scroll max-h-[60vh]">
              {listings.map(({ id, image }) => (
                <div
                  key={id}
                  onClick={() => handleSelectItem(id)}
                  className="relative flex justify-center items-center rounded-lg aspect-square w-full cursor-pointer shadow-lg hover:opacity-90 overflow-hidden"
                >
                  <img
                    src={image}
                    className={`h-full w-full object-cover ${
                      items?.includes(id) && "brightness-[30%]"
                    }`}
                  />
                  {items?.includes(id) && (
                    <CgCheck className="z-10 absolute text-white text-7xl pointer-events-none animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
    </div>
  );
};

export { ItemsSelect };
