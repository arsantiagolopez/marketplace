import axios from "axios";
import React, {
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { GoCheck } from "react-icons/go";
import { IoCloseSharp, IoPricetags } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { KeyedMutator } from "swr";
import { ListingEntity } from "../../../types";
import { getPriceData } from "../../../utils/getPriceData";
import { useEthPrice } from "../../../utils/useEthPrice";
import { PriceTag } from "../../PriceTag";

interface Props {
  currency: string;
  activePrice: string | number;
  setActivePrice: Dispatch<SetStateAction<string | number>>;
  handleChangeCurrency: () => void;
  listing?: ListingEntity;
  mutate: KeyedMutator<ListingEntity>;
}

const PriceEditable: FC<Props> = ({
  currency,
  activePrice,
  setActivePrice,
  handleChangeCurrency,
  listing,
  mutate,
}) => {
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [editablePrice, setEditablePrice] = useState<string>("");

  const { price: ethRate } = useEthPrice();

  const inputRef = useRef(null);

  const dataHasChanged = editablePrice !== "" && Number(editablePrice) !== 0;

  const toggleEditActive = () => setIsEditActive(!isEditActive);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setEditablePrice(event?.target.value);

  const handleCancel = () => {
    // Reset state fields
    setIsEditActive(false);
    setEditablePrice("");
  };

  // Update seller profile
  const handleSave = async (): Promise<void> => {
    if (!ethRate) {
      console.log(
        "ETH price could not be fetched. Price can't be updated. Try again later."
      );
      return handleCancel();
    }

    // Get prices formatted for db
    const prices = getPriceData({
      currency,
      inputPrice: parseFloat(editablePrice),
      ethRate,
    });

    if (!prices) {
      console.log("Price exchanges could not be calculated. Try again later.");
      return handleCancel();
    }

    // Create listing
    const { status } = await axios.put(`/api/listings/${listing?.id}`, {
      prices,
    });

    if (status !== 200) {
      console.log("Price could not bet updated. Try again later.");
      return handleCancel();
    }

    console.log("TEST: ", { ...listing, price: prices });

    // @ts-ignore
    mutate({ ...listing, price: prices });

    setActivePrice(
      currency === "USD"
        ? String(prices.usd!.toString())
        : parseFloat(prices.eth!).toFixed(6)
    );

    // Reset state fields
    setIsEditActive(false);
    setEditablePrice("");
  };

  // Set focus to store name editable
  useEffect(() => {
    if (isEditActive) {
      if (inputRef.current) {
        // @ts-ignore
        inputRef.current.focus();
      }
    }
  }, [isEditActive]);

  const priceTagProps = { currency, price: activePrice, isListing: true };

  return (
    <div className="flex flex-row w-fit my-4">
      {!isEditActive ? (
        <button onClick={handleChangeCurrency}>
          <PriceTag {...priceTagProps} />
        </button>
      ) : (
        <div
          className={`relative flex flex-row items-center rounded-full shadow-lg h-12 px-6 w-fit transition-all ease-in-out duration-500 cursor-pointer max-w-full overflow-hidden ${
            isEditActive
              ? "bg-primary text-white"
              : "hover:bg-primary hover:text-white bg-white text-primary"
          }`}
        >
          <div className="flex flex-row items-center min-w-fit h-full rounded-r-full">
            <div
              className={`text-gray-300 text-xl ${
                isEditActive ? "text-3xl mr-1" : "text-xl mr-3"
              }`}
            >
              {isEditActive ? (
                <CgArrowsExchangeAltV onClick={handleChangeCurrency} />
              ) : (
                <IoPricetags />
              )}
            </div>

            <h1 className="font-Basic tracking-tight text-2xl flex flex-row items-center">
              {currency === "USD" ? (
                <span className="mx-1 mr-2 select-none">$</span>
              ) : (
                <img src="/currency/eth.png" className="h-5 mr-1" />
              )}

              {isEditActive ? (
                <input
                  ref={inputRef}
                  type="number"
                  value={editablePrice}
                  onChange={handleChange}
                  placeholder={activePrice?.toString()}
                  className="self-center bg-transparent w-full min-w-[1rem] py-0 focus:outline-none cursor-default "
                />
              ) : (
                <h1 className="text-primary">{activePrice}</h1>
              )}
            </h1>
          </div>
        </div>
      )}

      {isEditActive ? (
        <div className="flex flex-row items-center self-end">
          <IoCloseSharp
            onClick={handleCancel}
            className="text-gray-200 text-3xl cursor-pointer ml-2 hover:text-secondary"
          />
          {dataHasChanged && (
            <GoCheck
              onClick={handleSave}
              className="text-gray-300 text-2xl ml-2 cursor-pointer hover:text-secondary"
            />
          )}
        </div>
      ) : (
        <MdEdit
          onClick={toggleEditActive}
          className="mt-auto mb-1 text-gray-300 text-2xl ml-4 cursor-pointer hover:text-secondary"
        />
      )}
    </div>
  );
};

export { PriceEditable };
