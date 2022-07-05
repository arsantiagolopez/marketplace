import React, { Dispatch, FC, SetStateAction } from "react";
import { UseFormWatch } from "react-hook-form";
import { FileWithPreview } from "../../types";
import { PriceTag } from "../PriceTag";

interface FormData {
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  watch: UseFormWatch<FormData>;
  currency: string;
  file: FileWithPreview | null;
  validImageField: boolean;
  setValidImageField: Dispatch<SetStateAction<boolean>>;
  validPriceField: boolean;
  ethRate: string;
}

const Preview: FC<Props> = ({
  watch,
  currency,
  file,
  validImageField,
  setValidImageField,
  validPriceField,
  ethRate,
}) => {
  let prices =
    currency === "ETH"
      ? {
          eth: String(watch("price")),
          usd: String(watch("price") * parseFloat(ethRate!)),
        }
      : {
          eth: String(watch("price") / parseFloat(ethRate!)),
          usd: String(watch("price")),
        };

  const handleSuccess = () => setValidImageField(true);
  const handleError = () => setValidImageField(false);

  const priceTagProps = { prices, currency, ethRate };

  return (
    <div className="relative flex flex-col justify-start w-full h-full">
      <div className="z-10 ml-[10%] mt-[10%] rounded-xl w-8/12 aspect-square shadow-xl">
        <div className="relative w-full h-full p-4 ">
          <img
            src={file?.preview}
            onLoad={handleSuccess}
            onError={handleError}
            className="aspect-square object-cover h-full w-full rounded-xl overflow-hidden"
          />
          {!validImageField && (
            <div className="absolute top-0 left-0 h-full w-full rounded-xl bg-white"></div>
          )}
          <div className="absolute bottom-14 left-0 w-full flex justify-center">
            {validPriceField && <PriceTag {...priceTagProps} />}
          </div>
        </div>
      </div>
      <h1 className="z-10 pl-[10%] pr-[10vw] font-Basic text-6xl tracking-tighter truncate w-full py-4 text-primary">
        {watch("name")}
      </h1>

      {/* Flashing background */}
      <div className="absolute h-full w-full bg-gray-50 animate-[pulse_5s_ease-in-out_infinite]"></div>
    </div>
  );
};

export { Preview };
