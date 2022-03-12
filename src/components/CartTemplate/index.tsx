import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useContext, useEffect, useState } from "react";
import { GoCheck } from "react-icons/go";
import { IoTrashOutline } from "react-icons/io5";
import { createOrder } from "../../blockchain/Marketplace/createOrder";
import { CartContext } from "../../context/CartContext";
import { PreferencesContext } from "../../context/PreferencesContext";
import { CartItem } from "../../types";
import { getSecretEmoji } from "../../utils/getSecretEmoji";
import { useEthPrice } from "../../utils/useEthPrice";
import { usePrices } from "../../utils/usePrices";
import { Dialog } from "../Dialog";
import { PriceLabel } from "../SellerDashboard/PriceLabel";

interface Props {}

const CartTemplate: FC<Props> = () => {
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [cards, setCards] = useState<CartItem[] | null>(null);

  const router = useRouter();

  const { cartCount, cartItems, cleanCart } = useContext(CartContext);

  const { currency } = useContext(PreferencesContext);

  const { ethRate } = useEthPrice();

  // Check item name, return emoji instead of name if name contains emoji keyword
  const getNameOrEmoji = (name: string): string => getSecretEmoji(name) || name;

  const getFormattedPrice = (price: string): string => {
    return currency === "ETH" ? `${price} ETH` : `$${price}`;
  };

  const subtotal = cards
    ? cards.map(({ listing, items, quantity }) => {
        const { name, token } = listing;
        const { prices } = token;

        const { eth, usd } = usePrices({
          currency,
          prices,
          ethRate: ethRate!,
        });

        const itemsStringIdentidier = items?.length
          ? items
              .map(({ name, token: { prices } }, index) => {
                const { eth, usd } = usePrices({
                  currency,
                  prices,
                  ethRate: ethRate!,
                });

                let price = currency === "ETH" ? eth : usd;

                const str = `${getNameOrEmoji(name)} @ ${getFormattedPrice(
                  price
                )}`;

                if (!index) return ` + ${str}`;
                return str;
              })
              .join(" + ")
          : "";

        const signedPrice = getFormattedPrice(currency === "ETH" ? eth : usd);
        const receipt = `(${quantity}) ${name} @ ${signedPrice}${itemsStringIdentidier}`;

        return receipt;
      })
    : null;

  const total = cards
    ? cards
        .reduce((acc, card) => {
          let {
            listing: {
              token: { prices },
            },
            items,
            quantity,
          } = card;

          let { eth, usd } = usePrices({
            currency,
            prices,
            ethRate: ethRate!,
          });

          // Remove commas to perform operations
          usd = usd.replace(",", "");

          let price = currency === "ETH" ? eth : usd;

          let itemTotal: number = 0;

          // Account for extras prices
          if (items?.length) {
            itemTotal = items.reduce((itemsAcc, item) => {
              let {
                token: { prices: itemPrices },
              } = item;

              let { eth: itemEth, usd: itemUsd } = usePrices({
                currency,
                prices: itemPrices,
                ethRate: ethRate!,
              });

              // Remove commas to perform operations
              itemUsd = itemUsd.replace(",", "");

              let price = currency === "ETH" ? itemEth : itemUsd;

              return itemsAcc + parseFloat(price);
            }, 0);

            price = String(parseFloat(price) + itemTotal);
          }

          const total = parseFloat(price) * quantity!;
          return acc + total;
        }, 0)
        .toLocaleString()
    : null;

  // Create marketplace order
  const handleBuyNow = async () => {
    // Calculate accurate total price
    const ethTotal = cartItems.reduce((acc, card) => {
      const {
        listing: {
          token: { prices },
        },
        items,
        quantity,
      } = card;

      let itemTotal: number = 0;

      // Account for extras prices
      if (items?.length) {
        itemTotal = items.reduce((itemsAcc, item) => {
          let {
            token: { prices: itemPrices },
          } = item;
          return itemsAcc + parseFloat(itemPrices?.eth);
        }, 0);
      }

      const price =
        (parseFloat(prices?.eth) + parseFloat(String(itemTotal))) * quantity!;

      return acc + price;
    }, 0);

    // Make transaction
    await createOrder({ cartItems, total: ethTotal });

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
    if (cartItems.length) {
      setCards(cartItems);
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
            (
              {
                listing: {
                  listingId,
                  name,
                  image,
                  description,
                  token: { prices },
                },
                items,
                quantity,
              },
              index
            ) => (
              <Link key={index} href={`/listings/${listingId}`}>
                <div className="relative flex flex-col w-[49%] md:w-[19%] text-primary hover:cursor-pointer group hover:animate-pulse">
                  {/* Card quantity multiplier */}
                  {quantity && quantity > 1 && (
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
                    <PriceLabel prices={prices} />
                  </div>
                  <div className="flex flex-col py-2">
                    <h1 className="font-Basic text-xl font-bold tracking-tight capitalize">
                      {name}{" "}
                      {items?.length &&
                        `with ${items[0].name} ${
                          items?.length > 1 ? "and others..." : ""
                        }`}
                    </h1>
                    {/* Tailwind multiline truncate fix */}
                    <p className="text-tertiary leading-6 max-h-[3rem] ellipsis overflow-hidden">
                      {description}
                    </p>
                  </div>

                  {/* Card overlap effect */}
                  {quantity && quantity > 1 && (
                    <div className="z-10 absolute top-[0.5rem] right-[-0.5rem] w-full h-52 md:h-80 aspect-square rounded-lg shadow-lg overflow-hidden rotate-2">
                      <img
                        src={image}
                        alt={name}
                        className="object-center object-cover w-full h-full group-hover:opacity-90"
                      />
                    </div>
                  )}
                  {quantity && quantity > 2 && (
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
        <p className="flex flex-col text-right text-tertiary tracking-tight truncate max-w-[75%]">
          {subtotal
            ? subtotal.map((item, index) => <span key={index}>{item}</span>)
            : "-"}
        </p>
      </div>

      <div className="flex flex-row justify-between px-6 md:px-20 py-2">
        <p className="font-Basic text-2xl text-primary tracking-tight">Total</p>
        <p className="flex flex-row items-center font-Basic text-2xl text-primary tracking-tight">
          {currency === "ETH" ? (
            <img src="/currency/eth.png" className="h-5 mr-1" />
          ) : (
            <span className="mx-1 mr-2 select-none">$</span>
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
