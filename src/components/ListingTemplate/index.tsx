import React, { FC } from "react";
import { KeyedMutator } from "swr";
import { ListingEntity, SellerProfileEntity, UserSession } from "../../types";
import { PublicListingView } from "./PublicView";
import { SellerListingView } from "./SellerView";

interface Props {
  session?: UserSession;
  sellerProfile?: SellerProfileEntity;
  listing?: ListingEntity;
  mutate: KeyedMutator<ListingEntity>;
}

const ListingTemplate: FC<Props> = ({
  session,
  sellerProfile,
  listing,
  mutate,
}) => {
  const isSellerView = session?.user?.walletAddress === listing?.sellerAddress;

  const sellerViewProps = { sellerProfile, listing, mutate };
  const publicViewProps = { session, sellerProfile, listing };

  return isSellerView ? (
    <SellerListingView {...sellerViewProps} />
  ) : (
    <PublicListingView {...publicViewProps} />
  );
};

export { ListingTemplate };
