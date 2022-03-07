import axios from "axios";
import { useRouter } from "next/router";
import React, { FC, useContext, useEffect, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { CgCheck } from "react-icons/cg";
import { HiOutlineUpload } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import { RiLoader4Line } from "react-icons/ri";
import { createItem } from "../../blockchain";
import { PreferencesContext } from "../../context/PreferencesContext";
import { FileWithPreview, UserSession } from "../../types";
import { getPriceData } from "../../utils/getPriceData";
import { useEthPrice } from "../../utils/useEthPrice";
import { useItems } from "../../utils/useItems";
import { CompletedCheck } from "../CompletedCheck";
import { Dialog } from "../Dialog";
import { DropzoneField } from "../DropzoneField";
import { PriceCurrencyField } from "../PriceCurrencyField";
import { Tooltip } from "../Tooltip";
import { Preview } from "./Preview";

interface FormData {
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  session: UserSession;
}

const CreateItem: FC<Props> = ({ session }) => {
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [validImageField, setValidImageField] = useState<boolean>(false);
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mustRegisterSeller, setMustRegisterSeller] = useState<boolean>(
    !session?.user?.isSeller || false
  );

  const router = useRouter();

  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const { items, setItems } = useItems();

  const { price: ethRate } = useEthPrice();

  const { handleSubmit, register, watch, setValue } = useForm<FormData>();

  const nextItemsCount = items ? items?.length + 1 : 1;

  // Handle submit
  const onSubmit = async (values: FormData) => {
    setIsLoading(true);

    let { price, name, quantity } = values;

    name = name.toLowerCase();

    if (!ethRate) {
      console.log(
        "ETH price could not be fetched. Item won't be created. Try again later."
      );

      return setIsLoading(false);
    }

    // Get prices formatted for db
    const prices = getPriceData({ currency, inputPrice: price, ethRate });

    if (!file) {
      return setIsLoading(false);
    }

    // Upload image to IPFS with NFT.Storage
    let formData = new FormData();
    formData.append("image", file);
    formData.append("name", name);

    const { data: IPFSResult, status: IPFSStatus } = await axios.post(
      "/api/ipfs/image",
      formData
    );

    // Only create item record if NFT uploaded to IPFS
    if (IPFSStatus !== 200) {
      setIsLoading(false);
      return setOnSuccess(false);
    }

    const { ipnft: hash } = IPFSResult;

    try {
      // Create ERC1155Token & Marketplace item
      const item = await createItem({
        price: prices?.eth!,
        name,
        quantity: parseInt(String(quantity)),
        hash,
      });

      // Update items
      setItems([...items, item]);

      setIsLoading(false);
      setOnSuccess(true);
    } catch {
      setIsLoading(false);
      setOnSuccess(false);
    }
  };

  // Form fields registration
  const nameRegister: UseFormRegisterReturn = register("name", {
    required: "A name for your item is required.",
  });
  const priceRegister: UseFormRegisterReturn = register("price", {
    required: "What's a good price for your item?",
  });
  const quantityRegister: UseFormRegisterReturn = register("quantity", {
    required: "What's your initial stock?",
  });

  const validNameField = !!(watch("name") && watch("name").length > 2);
  const validPriceField = watch("price") > 0;
  const validQuantityField = watch("quantity") > 0;

  const isCompleted =
    validNameField && validImageField && validPriceField && validQuantityField;

  const nextButtonText = !isCompleted
    ? "Please complete all fields"
    : isLoading
    ? "Starting the transaction..."
    : "Looks good. Create item";

  const dropzoneFieldProps = { setFile };
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
    file,
    validImageField,
    setValidImageField,
    validPriceField,
  };
  const successDialogProps = {
    isOpen: onSuccess,
    setIsOpen: setOnSuccess,
    isCentered: true,
    type: "success",
    message:
      "Your item was successfully created. You can now add it to your listings!",
  };
  const sellerRegistrationDialogProps = {
    isOpen: mustRegisterSeller,
    setIsOpen: setMustRegisterSeller,
    isCentered: true,
    type: "loading",
    message:
      "You must create a seller profile to sell items on the Marketplace. Redirecting to registration page...",
  };

  // Redirect on success
  useEffect(() => {
    if (onSuccess) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  }, [onSuccess]);

  // Redirect if must register seller profile
  useEffect(() => {
    if (mustRegisterSeller) {
      setTimeout(() => {
        router.push("/register");
      }, 3000);
    }
  }, [mustRegisterSeller]);

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

        {/* Image */}
        <div className="form-field w-full md:py-3">
          <h1 className="relative title flex flex-row items-baseline">
            Add a picture of your item.
          </h1>
          <div className="relative flex flex-row items-center group">
            <DropzoneField {...dropzoneFieldProps}>
              <button
                className={`w-full py-2 pl-3 pr-8 my-2 md:my-4 text-left bg-white rounded-lg shadow-md truncate ${
                  !validImageField && "animate-pulse text-gray-400"
                }`}
              >
                {!file ? "..." : file.name}
              </button>
            </DropzoneField>

            {!file ? (
              <HiOutlineUpload className="absolute text-gray-300 text-2xl right-2 pointer-events-none group-hover:text-primary" />
            ) : validImageField ? (
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

        {/* Quantity */}
        <div className="form-field w-full md:py-3">
          <div className="flex flex-row items-baseline">
            <h1 className="title">Initial stock.</h1>
            <Tooltip label="Let's keep track of your inventory. What's your initial stock? You can re-stock when supply goes down.">
              <div className="flex justify-center items-center text-white bg-primary italic text-[9pt] rounded-full h-4 w-4 ml-2 ">
                i
              </div>
            </Tooltip>
          </div>

          <div className="relative flex flex-row items-center">
            <input
              step="1"
              type="number"
              spellCheck={false}
              autoComplete="off"
              className={`relative w-full py-2 pl-3 pr-8 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black ${
                !validNameField && "animate-pulse pr-0"
              }`}
              placeholder="100"
              {...quantityRegister}
            />
            {validNameField && (
              <CgCheck className="absolute text-green-500 text-3xl right-1 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Create Item */}
        <button
          type="submit"
          disabled={!isCompleted || isLoading}
          className={`flex justify-center font-Basic items-center rounded-full text-white mt-12 py-3 px-6 pr-4 w-full ${
            isCompleted && !isLoading
              ? "bg-primary hover:bg-black"
              : "bg-gray-600"
          }`}
        >
          {nextButtonText}
          <CompletedCheck
            isCompleted={isCompleted && !isLoading}
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
      <Dialog {...successDialogProps} />

      {/* Seller Registration Modal */}
      <Dialog {...sellerRegistrationDialogProps} />
    </div>
  );
};

export { CreateItem };
