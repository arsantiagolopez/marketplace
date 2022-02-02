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
  const { data: sellerProfile } = useSWR("/api/sellers");
  const { name: store }: SellerProfileEntity = sellerProfile || {};

  const price = watch("price");

  const handleSuccess = () => setValidImageField(true);
  const handleError = () => setValidImageField(false);

  const priceTagProps = { price, currency };

  return (
    <div className="flex flex-col justify-start w-full h-full pt-10 md:pt-16">
      <div className="bg-gray-50 rounded-xl w-7/12 h-fit md:max-h-[80vh] shadow-xl mb-6">
        <div className="relative w-full aspect-square p-4">
          <img
            src={watch("image")}
            onLoad={handleSuccess}
            onError={handleError}
            className="object-cover h-full w-full rounded-xl overflow-hidden"
          />
          {!validImageField && (
            <div className="absolute top-0 left-0 h-full w-full rounded-xl bg-gray-50"></div>
          )}
        </div>
      </div>

      <h1 className="font-Basic text-2xl tracking-tighter truncate h-8">
        {store}'s
      </h1>

      <h1 className="font-Basic text-4xl tracking-tighter truncate w-9/12 h-10 my-2">
        {watch("name") ? (
          <span>{watch("name")}</span>
        ) : (
          <div className="h-[3.25rem] w-full bg-gray-100 rounded-md animate-pulse"></div>
        )}
      </h1>

      <div className="text-tertiary overflow-scroll w-full min-h-[4rem] my-2">
        {watch("description") ? (
          <span>{watch("description")}</span>
        ) : (
          <div className="flex flex-col w-full h-full animate-pulse">
            <div className="h-6 w-full bg-gray-100 mb-3 rounded-sm"></div>
            <div className="h-6 w-[75%] bg-gray-100 mb-3 rounded-sm"></div>
          </div>
        )}
      </div>

      <div className="absolute bottom-12">
        <PriceTag {...priceTagProps} />
      </div>
    </div>
  );
};

export { Preview };
