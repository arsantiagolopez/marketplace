import axios from "axios";
import React, { FC, useContext, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { CgCheck } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { RiLoader4Line } from "react-icons/ri";
import { KeyedMutator } from "swr";
import { PreferencesContext } from "../../context/PreferencesContext";
import { ItemEntity } from "../../types";
import { getPriceData } from "../../utils/getPriceData";
import { useEthPrice } from "../../utils/useEthPrice";
import { CompletedCheck } from "../CompletedCheck";
import { Dialog } from "../Dialog";
import { PriceCurrencyField } from "../PriceCurrencyField";
import { Tooltip } from "../Tooltip";
import { Preview } from "./Preview";

interface FormData {
  name: string;
  price: number;
  image: string;
}

interface Props {
  items?: ItemEntity[];
  mutate: KeyedMutator<ItemEntity[]>;
}

const CreateItem: FC<Props> = ({ items, mutate }) => {
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [validImageField, setValidImageField] = useState<boolean>(false);

  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const { price: ethRate } = useEthPrice();

  const { handleSubmit, register, watch, setValue } = useForm<FormData>();

  const nextItemsCount = items ? items?.length + 1 : 1;

  // Handle submit
  const onSubmit = async (values: FormData) => {
    const { price, ...rest } = values;

    if (!ethRate) {
      console.log(
        "ETH price could not be fetched. Item won't be created. Try again later."
      );
      return;
    }

    // Get prices formatted for db
    const prices = getPriceData({ currency, inputPrice: price, ethRate });

    // Create item
    const { data, status } = await axios.post("/api/items", {
      ...rest,
      prices,
    });

    if (status !== 200) {
      return setOnSuccess(false);
    }

    mutate([...[items], data]);
    setOnSuccess(true);
  };

  // Form fields registration
  const nameRegister: UseFormRegisterReturn = register("name", {
    required: "A name for your item is required.",
  });
  const imageRegister: UseFormRegisterReturn = register("image", {
    required: "A picture for your item is required.",
  });
  const priceRegister: UseFormRegisterReturn = register("price", {
    required: "What's a good price for your item?",
  });

  const validNameField = !!(watch("name") && watch("name").length > 2);
  const validPriceField = watch("price") > 0;

  const isCompleted = validNameField && validImageField && validPriceField;

  const nextButtonText = !isCompleted
    ? "Please complete all fields"
    : "Create item";

  const priceCurrencyFieldProps = {
    priceRegister,
    validPriceField,
    currency,
    toggleCurrency,
    ethRate,
    setValue,
  };
  const previewProps = {
    watch,
    currency,
    validImageField,
    setValidImageField,
    validPriceField,
  };
  const dialogProps = {
    isOpen: onSuccess,
    setIsOpen: setOnSuccess,
    isCentered: true,
    type: "success",
    message:
      "Your item was created successfully. You can now add it to your listings!",
  };

  return (
    <div className="flex flex-row md:grid md:grid-cols-2 min-h-[calc(100vh-5rem)] px-6 md:px-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center md:justify-start w-full md:pl-[30%] md:pr-[10%] py-[10%]"
      >
        <h1 className="text-4xl md:text-6xl font-Basic tracking-tighter self-start mb-12 md:mb-8">
          Create an Item.
        </h1>

        {/* Name */}
        <div className="form-field w-full md:py-3">
          <h1 className="title">Your item's name.</h1>
          <div className="relative flex flex-row items-center">
            <input
              step="0.01"
              spellCheck={false}
              autoComplete="off"
              className={`relative w-full py-2 pl-3 pr-8 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black ${
                !validNameField && "animate-pulse pr-0"
              }`}
              placeholder={`My Item #${nextItemsCount}`}
              {...nameRegister}
            />
            {validNameField && (
              <CgCheck className="absolute text-green-500 text-3xl right-1 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Image URL */}
        <div className="form-field w-full md:py-3">
          <h1 className="relative title flex flex-row items-baseline">
            Add a picture URL for your item.{" "}
            <Tooltip label="For testing purposes, we'll treat the image as a URL. Find one in Google Images.">
              <div className="hidden md:flex justify-center items-center text-white bg-primary italic text-[9pt] rounded-full h-4 w-4 ml-2 pr-1">
                i
              </div>
            </Tooltip>
          </h1>
          <div className="relative flex flex-row items-center">
            <input
              spellCheck={false}
              autoComplete="off"
              className={`relative w-full py-2 pl-3 pr-8 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black truncate ${
                !validImageField && "animate-pulse pr-0"
              }`}
              placeholder="https://img.taste.com.au/ol2Jq8ZQ/taste/2016/11/rachel-87711-2.jpeg"
              {...imageRegister}
            />
            {!watch("image") ? null : validImageField ? (
              <CgCheck className="absolute text-green-500 text-3xl right-1 pointer-events-none" />
            ) : (
              <IoCloseSharp className="absolute text-red-600 text-xl right-2 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Price */}
        <div className="form-field w-full md:py-3">
          <PriceCurrencyField {...priceCurrencyFieldProps} />
        </div>

        {/* Create Item */}
        <button
          type="submit"
          disabled={!isCompleted}
          className={`flex justify-center font-Basic items-center rounded-full text-white mt-12 py-3 px-6 pr-4 w-full ${
            isCompleted ? "bg-primary hover:bg-black" : "bg-gray-600"
          }`}
        >
          {nextButtonText}
          <CompletedCheck
            isCompleted={isCompleted}
            CustomSpinner={
              <RiLoader4Line className="text-xl ml-3 mr-1 pointer-events-none text-white animate-spin-slow" />
            }
          />
        </button>
      </form>

      {/* Desktop Preview */}
      <div className="hidden md:flex flex-col sticky top-20 w-full h-[calc(100vh-5rem)]">
        <Preview {...previewProps} />
      </div>

      {/* Success/failure Modal */}
      <Dialog {...dialogProps} />
    </div>
  );
};

export { CreateItem };
