import React, { FC, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { CgCheck } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { RiLoader4Line } from "react-icons/ri";
import { CompletedCheck } from "../CompletedCheck";
import { Tooltip } from "../Tooltip";
import { ItemsSelect } from "./ItemsSelect";
import { Preview } from "./Preview";
import { PriceCurrencyField } from "./PriceCurrencyField";

interface Props {}

interface FormData {
  name: string;
  description: string;
  price: number;
  image: string;
  items: string[];
}

const CreateListing: FC<Props> = () => {
  const [currency, setCurrency] = useState<string>("USD");
  const [items, setItems] = useState<string[] | null>(null);
  const [validImageField, setValidImageField] = useState<boolean>(false);

  const { handleSubmit, register, watch } = useForm<FormData>();

  // Handle submit
  // const onSubmit = async ({
  //   name,
  //   description,
  //   price,
  //   image,
  //   items,
  // }: FormData) => {
  const onSubmit = async (values: FormData) => {
    console.log(values);
    // // Create seller profile
    // if (store) {
    //   await axios.post("/api/sellers", { name: store });
    // }
    // // Update user
    // await axios.put("/api/users/", { name, isSeller: !!store });
    // setOnSuccess(true);
  };

  // Form fields registration
  const nameRegister: UseFormRegisterReturn = register("name", {
    required: "A name for your listing is required.",
  });
  const imageRegister: UseFormRegisterReturn = register("image", {
    required: "A picture for your listing is required.",
  });
  const priceRegister: UseFormRegisterReturn = register("price", {
    required: "What's a good price for your listing?",
  });
  const descriptionRegister: UseFormRegisterReturn = register("description", {
    required: "A description for your listing is required.",
  });
  const itemsRegister: UseFormRegisterReturn = register("items");

  const validNameField = !!(watch("name") && watch("name").length > 2);
  const validPriceField = watch("price") > 0;
  const validDescriptionField = !!watch("description");

  const isCompleted =
    validNameField &&
    validImageField &&
    validPriceField &&
    validDescriptionField;

  const nextButtonText = !isCompleted
    ? "Please complete all fields"
    : "Looks good. Create listing";

  const priceCurrencyFieldProps = {
    priceRegister,
    validPriceField,
    currency,
    setCurrency,
  };
  const itemsSelectProps = { items, setItems, itemsRegister };
  const previewProps = {
    watch,
    currency,
    validImageField,
    setValidImageField,
  };

  return (
    <div className="flex flex-row md:grid md:grid-cols-2 md:gap-[2%] min-h-[calc(100vh-5rem)]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center px-6 md:pl-[40%] w-full py-10 md:py-12"
      >
        {/* Name */}
        <div className="form-field w-full md:py-3">
          <h1 className="title">Give your listing a name.</h1>
          <div className="relative flex flex-row items-center">
            <input
              spellCheck={false}
              autoComplete="off"
              className={`relative w-full py-2 pl-3 pr-8 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black ${
                !validNameField && "animate-pulse pr-0"
              }`}
              placeholder={`My Listing #${1}`} // listings.length
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
            Add a picture URL for your listing.{" "}
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
              placeholder="https://www.carlogos.org/car-logos/tesla-logo-2200x2800.png"
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

        {/* Description */}
        <div className="form-field w-full md:py-3">
          <h1 className="title">Description.</h1>
          <div className="relative flex flex-row items-center">
            <textarea
              autoComplete="off"
              className={`relative resize w-full py-2 md:py-2 pl-3 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black min-h-[5rem] min-w-full max-w-full ${
                !validDescriptionField && "animate-pulse"
              }`}
              placeholder="Say something nice about your product."
              {...descriptionRegister}
            />
            {validDescriptionField && (
              <CgCheck className="absolute text-green-500 text-3xl right-1 top-5 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Items */}
        <div className="form-field w-full md:py-3">
          <ItemsSelect {...itemsSelectProps} />
        </div>

        {/* Complete listing */}
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

      {/* Desktop preview */}
      <div className="hidden md:flex flex-col sticky top-20 self-start w-full h-[calc(100vh-5rem)] px-6 md:pr-[30%]">
        <Preview {...previewProps} />
      </div>
    </div>
  );
};

export { CreateListing };
