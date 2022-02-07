import React, { FC } from "react";
import { KeyedMutator } from "swr";
import { ListingEntity, SellerProfileEntity } from "../../types";
import { PublicListingView } from "./PublicView";
import { SellerListingView } from "./SellerView";

interface Props {
  isSellerView: boolean;
  sellerProfile?: SellerProfileEntity;
  listing?: ListingEntity;
  mutate: KeyedMutator<ListingEntity>;
}

const ListingTemplate: FC<Props> = ({
  isSellerView,
  sellerProfile,
  listing,
  mutate,
}) => {
  const sellerViewProps = { sellerProfile, listing, mutate };
  const publicViewProps = { sellerProfile, listing };

  return isSellerView ? (
    <SellerListingView {...sellerViewProps} />
  ) : (
    <PublicListingView {...publicViewProps} />
  );
};

export { ListingTemplate };
