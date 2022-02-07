import React, { Dispatch, FC, SetStateAction } from "react";
import { UseFormWatch } from "react-hook-form";
import useSWR from "swr";
import { SellerProfileEntity } from "../../types";
import { PriceTag } from "../PriceTag";

interface FormData {
  name: string;
  description: string;
  price: number;
  image: string;
  items: string[];
}

interface Props {
  watch: UseFormWatch<FormData>;
  currency: string;
  validImageField: boolean;
  setValidImageField: Dispatch<SetStateAction<boolean>>;
}

const Preview: FC<Props> = ({
  watch,
  currency,
  validImageField,
  setValidImageField,
}) => {
  const { data: sellerProfile } = useSWR<SellerProfileEntity, any>(
    "/api/sellers"
  );
  const { name: store } = sellerProfile || {};

  const price = watch("price");

  const handleSuccess = () => setValidImageField(true);
  const handleError = () => setValidImageField(false);

  const priceTagProps = {
    price,
    currency,
    isListing: true,
  };

  return (
    <div className="flex flex-col justify-start w-full h-full pl-[10%]">
      <div className="z-10 mt-[10%] w-full pr-[50%]">
        <div className="bg-white rounded-xl w-[22.5vw] h-fit md:max-h-[80vh] shadow-lg">
          <div className="relative w-full aspect-square p-4">
            <img
              src={watch("image")}
              onLoad={handleSuccess}
              onError={handleError}
              className="object-cover h-full w-full rounded-xl overflow-hidden"
            />
            {!validImageField && (
              <div className="absolute top-0 left-0 h-full w-full rounded-xl bg-white"></div>
            )}
          </div>
        </div>

        <h1 className="font-Basic text-2xl tracking-tighter truncate h-8 mt-6">
          {store}'s
        </h1>

        <h1
          className={`font-Basic text-5xl tracking-tighter w-full h-14 my-2 ${
            watch("name") && "truncate"
          }`}
        >
          {watch("name") ? (
            <span>{watch("name")}</span>
          ) : (
            <div className="h-10 mb-4 w-full bg-white rounded-md animate-pulse shadow-xl"></div>
          )}
        </h1>

        <div className="text-tertiary w-full min-h-[5rem]">
          {watch("description") ? (
            <span>{watch("description")}</span>
          ) : (
            <div className="flex flex-col w-full h-full animate-pulse">
              <div className="h-6 w-full bg-white mb-3 rounded-sm shadow-xl"></div>
              <div className="h-6 w-full bg-white mb-3 rounded-sm shadow-xl"></div>
            </div>
          )}
        </div>

        <div className="absolute bottom-[10%] mr-[10%] max-w-[75%]">
          <PriceTag {...priceTagProps} />
        </div>
      </div>

      {/* Flashing background */}
      <div className="absolute h-full w-full bg-gray-50 animate-[pulse_5s_ease-in-out_infinite] ml-[-10%]"></div>
    </div>
  );
};

export { Preview };
