import axios from "axios";
import React, { FC, useState } from "react";
import useSWR from "swr";
import { SellerProfileEntity } from "../../types";
import { ImageEditable } from "./ImageEditable";
import { Items } from "./Items";
import { Listings } from "./Listings";
import { Orders } from "./Orders";
import { StoreNameEditable } from "./StoreNameEditable";

const listings: Listing[] = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/2607108/pexels-photo-2607108.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 50,
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/2670273/pexels-photo-2670273.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 75,
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 13,
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 35,
  },
  {
    id: 5,
    image:
      "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 20,
  },
  {
    id: 6,
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 35,
  },
  {
    id: 7,
    image:
      "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 20,
  },
  {
    id: 8,
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 13,
  },
  {
    id: 9,
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 35,
  },
  {
    id: 10,
    image:
      "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 20,
  },
  {
    id: 11,
    image:
      "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 35,
  },
  {
    id: 12,
    image:
      "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    price: 20,
  },
];

interface Listing {
  id: number;
  image: string;
  price: number;
}

interface Props {}

const SellerDashboard: FC<Props> = () => {
  const [isActiveUpdate, setIsActiveUpdate] = useState<boolean>(false);
  const [editableStoreName, setEditableStoreName] = useState<string>("");
  const [editableImage, setEditableImage] = useState<string>("");

  const { data: sellerProfile, mutate } = useSWR("/api/sellers");
  const { name: store, image }: SellerProfileEntity = sellerProfile || {};

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
    editableImage,
    setEditableImage,
    image,
  };
  const listingsProps = { listings };
  const itemsProps = { listings };
  const ordersProps = { listings };

  return (
    <div className="flex flex-col w-full h-full bg-white pb-20">
      <div className="h-24 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>
      <div className="z-10 flex flex-row items-center mt-[-6rem] px-4 md:px-20 h-12 max-h-12">
        <div className="w-fit">
          <StoreNameEditable {...storeNameEditableProps} />
        </div>
        <div className="flex-auto overflow-hidden ml-4 h-full py-1">
          <ImageEditable {...imageEditableProps} />
        </div>
      </div>

      <div className="mt-12 pt-12">
        <Listings {...listingsProps} />
      </div>

      <div className="flex flex-row flex-wrap w-full pt-6 text-primary">
        <Items {...itemsProps} />
        <Orders {...ordersProps} />
      </div>
    </div>
  );
};

export { SellerDashboard };
