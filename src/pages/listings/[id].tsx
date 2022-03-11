import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { getAllItems, getItemById, getListingById } from "../../blockchain";
import { Layout } from "../../components/Layout";
import { ListingTemplate } from "../../components/ListingTemplate";
import {
  ItemEntity,
  ListingEntity,
  ProtectedPage,
  SellerProfileEntity,
  UserSession,
} from "../../types";
import { useEthPrice } from "../../utils/useEthPrice";

interface Props {}

interface Session {
  data: UserSession;
}

const ListingPage: ProtectedPage<Props> = () => {
  const [listing, setListing] = useState<ListingEntity | undefined>();
  const [items, setItems] = useState<ItemEntity[] | undefined>();
  const [allItems, setAllItems] = useState<ItemEntity[] | undefined>();

  const { query } = useRouter();
  const { data: sellerProfile } = useSWR<SellerProfileEntity, any>(
    listing && `/api/sellers/${listing?.token.seller}`
  );
  const { data: session } = useSession() as unknown as Session;

  const { ethRate } = useEthPrice();

  // Fetch listing from contract
  const fetchListingById = async (id: number, rate: string) => {
    const data = await getListingById(id, rate);
    setListing(data);
  };

  // Fetch items related to listing
  const fetchItemsById = async (ids: number[], rate: string) => {
    let itemsArr: ItemEntity[] = [];
    for await (const itemId of ids) {
      const item = await getItemById(itemId, rate);
      if (item) {
        itemsArr.push(item);
      }
    }
    setItems(itemsArr);
  };

  // Fetch all items by seller
  const fetchAllItemsBySeller = async (rate: string) => {
    const items = await getAllItems(rate);
    const sellerItems = items.filter(
      ({ token }) => token?.seller === listing?.token?.seller
    );
    setAllItems(sellerItems);
  };

  const listingTemplateProps = {
    session,
    sellerProfile,
    listing,
    setListing,
    items,
    allItems,
  };

  // Fetch listing entity
  useEffect(() => {
    if (ethRate) {
      fetchListingById(Number(query?.id), ethRate);
    }
  }, [query, ethRate]);

  // Fetch extra items related to listing
  useEffect(() => {
    if (listing?.itemIds && ethRate) {
      fetchItemsById(listing?.itemIds, ethRate);
    }
  }, [listing, ethRate]);

  // Fetch all items to filter from in case of all
  useEffect(() => {
    if (ethRate) {
      fetchAllItemsBySeller(ethRate);
    }
  }, [listing, ethRate]);

  return (
    <>
      <Head>
        <title>
          {listing?.name} | {process.env.NEXT_PUBLIC_BRAND_NAME}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <ListingTemplate {...listingTemplateProps} />
      </Layout>
    </>
  );
};

ListingPage.isProtected = true;

export default ListingPage;
