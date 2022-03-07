import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useContext, useEffect, useState } from "react";
import { GoCheck } from "react-icons/go";
import { IoTrashOutline } from "react-icons/io5";
import { createOrder } from "../../blockchain/Marketplace/createOrder";
import { CartContext } from "../../context/CartContext";
import { PreferencesContext } from "../../context/PreferencesContext";
import { ListingEntity } from "../../types";
import { useEthPrice } from "../../utils/useEthPrice";
import { Dialog } from "../Dialog";
import { PriceLabel } from "../SellerDashboard/PriceLabel";

interface Props {}

interface ListingCard {
  listing: ListingEntity;
  quantity: number;
}

const CartTemplate: FC<Props> = () => {
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [cards, setCards] = useState<ListingCard[] | null>(null);

  const router = useRouter();

  const { cartCount, cartListings, cleanCart } = useContext(CartContext);

  const { currency } = useContext(PreferencesContext);
  const { price: ethRate } = useEthPrice();

  const formattedEth = (price: string): string => {
    return parseFloat(price).toFixed(6);
  };

  const formattedUsd = (price: string): string => {
    return parseFloat(price).toLocaleString();
  };

  const subtotal = cards
    ? cards.map(({ listing, quantity }) => {
        const { name, token } = listing;
        const { price } = token;

        const eth = formattedEth(price);
        const usd = formattedUsd(String(Number(price) * Number(ethRate)));

        return `(${quantity}) ${name} @ ${
          currency === "ETH"
            ? `${Number(eth).toLocaleString()} ETH`
            : `$${Number(usd).toLocaleString()}`
        }`;
      })
    : null;

  const total = cards
    ? cards
        .reduce((acc, card) => {
          let {
            listing: {
              token: { price },
            },
            quantity,
          } = card;

          const eth = formattedEth(price);
          const usd = formattedUsd(String(Number(price) * Number(ethRate)));

          price = currency === "ETH" ? eth : usd;

          const total = Number(price) * quantity;
          return acc + total;
        }, 0)
        .toLocaleString()
    : null;

  // Create marketplace order
  const handleBuyNow = async () => {
    // Calculate accurate total price
    const total = cartListings.reduce((acc, card) => {
      const {
        token: { price },
      } = card;
      return acc + Number(price);
    }, 0);

    const order = await createOrder({ listings: cartListings, total });

    // On success
    setOnSuccess(true);
    // Wipe items off cart
    cleanCart();
  };

  const successDialogProps = {
    isOpen: onSuccess,
    setIsOpen: setOnSuccess,
    isCentered: true,
    type: "success",
    message:
      "Congrats! Your order's in, the item's yours. Redirecting to your Tokens page.",
  };

  // Bundle multiple listings into one card
  useEffect(() => {
    // Handle cleaned cart
    if (cartCount === 0) {
      setCards(null);
    }

    // Bundle up listings with their quantities
    if (cartListings.length) {
      const uniqueListings = [
        ...new Map(cartListings.map((obj) => [obj.listingId, obj])).values(),
      ];

      const uniqueCards = uniqueListings.map((listing) => {
        const quantity = cartListings.filter(
          ({ listingId }) => listingId === listing.listingId
        ).length;
        return { listing, quantity };
      });

      setCards(uniqueCards);
    }
  }, [cartCount]);

  // Redirect on success
  useEffect(() => {
    if (onSuccess) {
      setTimeout(() => {
        router.push("/tokens");
      }, 3000);
    }
  }, [onSuccess]);

  return (
    <div className="flex flex-col w-full h-full bg-white pb-20">
      <div className="h-24 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>

      <div className="z-10 flex flex-row items-center px-4 md:px-20 h-16 mt-[-4.75em] md:mt-[-6rem] w-full">
        <h1 className="text-5xl md:text-5xl font-Basic text-primary tracking-tighter">
          Cart
        </h1>
      </div>

      <div className="pt-[4rem] md:mt-[2rem] w-full px-6 md:px-20">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col justify-start font-Basic text-primary">
            <h1 className="text-4xl md:text-4xl tracking-tighter">Check out</h1>
            <h1 className="text-tertiary text-xl md:text-2xl tracking-tight py-1 md:py-2">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </h1>
          </div>
          <button className=""></button>
          <IoTrashOutline
            onClick={cleanCart}
            className="text-3xl md:text-4xl cursor-pointer text-tertiary hover:text-primary mb-4 md:mb-3 self-end"
          />
        </div>
      </div>

      <div className="flex flex-nowrap overflow-scroll w-auto gap-3 md:gap-6 py-4 md:py-12 px-6 md:px-20">
        {!cards ? (
          <div className="flex flex-col w-[49%] md:w-[19%] text-primary hover:cursor-pointer group hover:animate-pulse">
            <div className="relative flex flex-row justify-center w-full h-52 md:h-80 aspect-square bg-gray-50 animate-pulse rounded-lg shadow-lg overflow-hidden"></div>
          </div>
        ) : (
          cards?.map(
            ({
              listing: {
                listingId,
                name,
                image,
                description,
                token: { price },
              },
              quantity,
            }) => (
              <Link key={listingId} href={`/listings/${listingId}`}>
                <div className="relative flex flex-col w-[49%] md:w-[19%] text-primary hover:cursor-pointer group hover:animate-pulse">
                  {/* Card quantity multiplier */}
                  {quantity > 1 && (
                    <div className="z-30 absolute top-4 right-2 flex items-center justify-center h-8 w-8 md:h-10 md:w-10 font-Basic text-xl md:text-2xl text-white tracking-tight rounded-full bg-primary">
                      x{quantity}
                    </div>
                  )}

                  {/* Top card */}
                  <div className="z-20 relative flex flex-row justify-center w-full h-52 md:h-80 aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={image}
                      alt={name}
                      className="object-center object-cover w-full h-full group-hover:opacity-90"
                    />
                    <PriceLabel price={price} />
                  </div>
                  <div className="flex flex-col py-2">
                    <h1 className="font-Basic text-xl font-bold tracking-tight capitalize">
                      {name}
                    </h1>
                    {/* Tailwind multiline truncate fix */}
                    <p className="text-tertiary leading-6 max-h-[3rem] ellipsis overflow-hidden">
                      {description}
                    </p>
                  </div>

                  {/* Card overlap effect */}
                  {quantity > 1 && (
                    <div className="z-10 absolute top-[0.5rem] right-[-0.5rem] w-full h-52 md:h-80 aspect-square rounded-lg shadow-lg overflow-hidden rotate-2">
                      <img
                        src={image}
                        alt={name}
                        className="object-center object-cover w-full h-full group-hover:opacity-90"
                      />
                    </div>
                  )}
                  {quantity > 2 && (
                    <div className="absolute top-[1rem] right-[-1rem] w-full h-52 md:h-80 aspect-square rounded-lg shadow-lg overflow-hidden rotate-3">
                      <img
                        src={image}
                        alt={name}
                        className="object-center object-cover w-full h-full group-hover:opacity-90"
                      />
                    </div>
                  )}
                </div>
              </Link>
            )
          )
        )}
      </div>

      <div className="flex flex-row justify-between px-6 md:px-20 py-2 pt-8 md:pt-4">
        <p className="text-tertiary tracking-tight">Subtotal</p>
        <p className="flex flex-col text-right text-tertiary tracking-tight truncate max-w-full">
          {subtotal
            ? subtotal.map((item, index) => <span key={index}>{item}</span>)
            : "-"}
        </p>
      </div>

      <div className="flex flex-row justify-between px-6 md:px-20 py-2">
        <p className="font-Basic text-2xl text-primary tracking-tight">Total</p>
        <p className="flex flex-row items-center font-Basic text-2xl text-primary tracking-tight">
          {currency === "USD" ? (
            <span className="mx-1 mr-2 select-none">$</span>
          ) : (
            <img src="/currency/eth.png" className="h-5 mr-1" />
          )}
          {total ? total : "-"}
        </p>
      </div>

      <button
        onClick={handleBuyNow}
        className="button flex flex-row items-center justify-center w-auto md:w-fit mx-4 md:mx-20 mt-8"
      >
        Buy now
        <GoCheck className="ml-2 mr-[-0.5rem]" />
      </button>

      {/* Success/failure Modal */}
      <Dialog {...successDialogProps} />
    </div>
  );
};

export { CartTemplate };
