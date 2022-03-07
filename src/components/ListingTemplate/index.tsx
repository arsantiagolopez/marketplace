import { useRouter } from "next/router";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { ListingEntity, SellerProfileEntity, UserSession } from "../../types";
import { PublicListingView } from "./PublicView";
import { SellerListingView } from "./SellerView";

interface Props {
  session?: UserSession;
  sellerProfile?: SellerProfileEntity;
  listing?: ListingEntity;
  setListing: Dispatch<SetStateAction<ListingEntity | undefined>>;
}

const ListingTemplate: FC<Props> = ({
  session,
  sellerProfile,
  listing,
  setListing,
}) => {
  const isSellerView = session?.user?.walletAddress === listing?.token.seller;

  const router = useRouter();

  const sellerViewProps = { sellerProfile, listing, setListing };
  const publicViewProps = { session, sellerProfile, listing };

  // Listing doesn't exist, redirect to explore page
  useEffect(() => {
    const isLoaded = typeof listing !== "undefined";
    if (isLoaded && !listing) {
      router.push("/explore");
    }
  }, [listing]);

  return listing && isSellerView ? (
    <SellerListingView {...sellerViewProps} />
  ) : (
    <PublicListingView {...publicViewProps} />
  );
};

export { ListingTemplate };
