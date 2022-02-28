import React, { FC } from "react";
import { ListingEntity, SellerProfileEntity, UserSession } from "../../types";
import { PublicListingView } from "./PublicView";
import { SellerListingView } from "./SellerView";

interface Props {
  session?: UserSession;
  sellerProfile?: SellerProfileEntity;
  listing?: ListingEntity;
}

const ListingTemplate: FC<Props> = ({ session, sellerProfile, listing }) => {
  const isSellerView = session?.user?.walletAddress === listing?.token.seller;

  const sellerViewProps = { sellerProfile, listing };
  const publicViewProps = { session, sellerProfile, listing };

  return isSellerView ? (
    <SellerListingView {...sellerViewProps} />
  ) : (
    <PublicListingView {...publicViewProps} />
  );
};

export { ListingTemplate };
