import React, { FC, useContext, useEffect, useState } from "react";
import { getMyOrders } from "../../blockchain/Marketplace/getMyOrders";
import { PreferencesContext } from "../../context/PreferencesContext";
import { OrderEntity, SellerProfileEntity } from "../../types";
import { useEthPrice } from "../../utils/useEthPrice";
import { CompletedCheck } from "../CompletedCheck";

interface Props {
  sellerProfile?: SellerProfileEntity;
}

const Orders: FC<Props> = ({ sellerProfile }) => {
  const [orders, setOrders] = useState<OrderEntity[] | null>(null);

  const { address } = sellerProfile || {};

  const { currency, toggleCurrency } = useContext(PreferencesContext);
  const { ethRate } = useEthPrice();

  const getFormattedPrice = (invoice: string): string => {
    const eth = invoice;
    const usd = (price: string) =>
      (parseFloat(price) * parseFloat(ethRate!)).toLocaleString();

    if (currency === "ETH") return eth;
    else return usd(invoice);
  };

  const fetchMyOrders = async (rate: string) => {
    const myOrders = await getMyOrders(rate);
    setOrders(myOrders);
  };

  useEffect(() => {
    if (ethRate) {
      fetchMyOrders(ethRate);
    }
  }, [ethRate]);

  return (
    <div className="flex-auto min-w-full md:min-w-0 md:w-[60%] transition-all ease-in-out">
      <div className="flex flex-row items-baseline">
        <h1 className="font-Basic text-primary tracking-tight text-3xl pl-4 md:pl-20 pr-2">
          Orders
        </h1>
        <p className="text-gray-300">({orders?.length || "0"})</p>
      </div>

      <div className="flex flex-col space-y-3 min-h-[32rem] max-h-[32rem] overflow-scroll mx-4 md:mx-20 my-8 text-secondary">
        {orders?.map(
          ({ orderId, name, image, listingIds, invoice, seller }) => {
            const identifier =
              listingIds.length > 1 ? `${name} & others` : name;
            const soldByMe = seller === address;
            const action = soldByMe ? "Sold" : "Bought";
            const shortAddress =
              seller?.substring(0, 5) +
              "..." +
              seller?.substring(seller.length - 5);

            return (
              <div
                key={orderId}
                onClick={toggleCurrency}
                className="flex flex-row items-center w-full hover:bg-gray-50 rounded-xl"
              >
                <div className="rounded-lg aspect-square w-24 h-24 min-h-[6rem] min-w-[6rem] overflow-hidden shadow-lg">
                  <img src={image} className="h-full w-full object-cover" />
                </div>
                <div className="hidden md:flex flex-row justify-between w-full space-x-3 md:space-x-6 ml-10 mr-6 text-secondary">
                  <p>{identifier}</p>
                  <p>
                    {action} for{" "}
                    <span className="flex flex-row items-center font-medium">
                      {currency === "ETH" ? (
                        <img src="/currency/eth.png" className="h-5" />
                      ) : (
                        <span className="mx-1 select-none">$</span>
                      )}
                      {getFormattedPrice(invoice)}
                    </span>
                  </p>
                  <p>
                    {action} {soldByMe ? "to" : "from"}{" "}
                    <span className="font-medium">{shortAddress}</span>
                  </p>
                  <div className="flex flex-row">
                    <p>Completed</p>
                    <CompletedCheck isCompleted={true} />
                  </div>
                </div>
                <div className="inline-block md:hidden ml-4 mr-2">
                  <p>
                    <span className="font-semibold">
                      {soldByMe ? "Sale - " : "Purchase - "}
                    </span>
                    {identifier} {soldByMe ? "sold to" : "bought from"} (
                    {shortAddress}) for{" "}
                    <span className="flex flex-row items-center">
                      {currency === "ETH" ? (
                        <img src="/currency/eth.png" className="h-5" />
                      ) : (
                        <span className="mx-1 select-none">$</span>
                      )}
                      <span className="px-2">{getFormattedPrice(invoice)}</span>
                    </span>
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export { Orders };
