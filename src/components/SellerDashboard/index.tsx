import axios from "axios";
import React, { FC, useState } from "react";
import useSWR from "swr";
import { SellerProfileEntity } from "../../types";
import { ImageEditable } from "./ImageEditable";
import { Items } from "./Items";
import { Listings } from "./Listings";
import { Orders } from "./Orders";
import { StoreNameEditable } from "./StoreNameEditable";

interface Props {}

const SellerDashboard: FC<Props> = () => {
  const [isActiveUpdate, setIsActiveUpdate] = useState<boolean>(false);
  const [editableStoreName, setEditableStoreName] = useState<string>("");
  const [editableImage, setEditableImage] = useState<string>("");

  const { data: sellerProfile, mutate } = useSWR<SellerProfileEntity, any>(
    "/api/sellers"
  );
  const { name: store, image } = sellerProfile || {};

  const dataHasChanged = editableStoreName !== "" || editableImage !== "";

  const handleCancel = () => {
    setIsActiveUpdate(false);
    setEditableStoreName("");
    setEditableImage("");
  };

  // Update seller profile
  const handleSave = async (): Promise<void> => {
    const name = editableStoreName ? editableStoreName : undefined;
    const image = editableImage ? editableImage : undefined;
    const { data, status } = await axios.put("/api/sellers", { name, image });

    if (status !== 200) {
      return console.log("Something went awfully wrong. Try again later.");
    }

    mutate({ ...sellerProfile, ...data });

    // Reset state fields
    setEditableStoreName("");
    setEditableImage("");
    setIsActiveUpdate(false);
  };

  const storeNameEditableProps = {
    isActiveUpdate,
    setIsActiveUpdate,
    editableStoreName,
    setEditableStoreName,
    handleCancel,
    handleSave,
    store,
    dataHasChanged,
  };
  const imageEditableProps = {
    isActiveUpdate,
    setIsActiveUpdate,
    editableImage,
    setEditableImage,
    image,
  };
  const ordersProps = { sellerProfile };

  return (
    <div className="flex flex-col w-full h-full bg-white pb-20">
      <div className="h-24 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>

      <div className="z-10 flex flex-row px-4 md:px-20 h-16 mt-[-4.75em] md:mt-[-6rem]">
        <div className="w-fit">
          <StoreNameEditable {...storeNameEditableProps} />
        </div>
        <div className="flex-auto ml-4 overflow-hidden">
          <ImageEditable {...imageEditableProps} />
        </div>
      </div>

      <div className="md:mt-8 pt-12">
        <Listings />
      </div>

      <div className="flex flex-row flex-wrap w-full pt-6 text-primary">
        <Items />
        <Orders {...ordersProps} />
      </div>
    </div>
  );
};

export { SellerDashboard };
