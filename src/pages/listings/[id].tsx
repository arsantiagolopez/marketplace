import type { NextPage } from "next";
import Head from "next/head";
// import { useRouter } from "next/router";
import React from "react";
// import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { ListingTemplate } from "../../components/ListingTemplate";
import { ListingEntity } from "../../types";

const ListingPage: NextPage = () => {
  // const { query } = useRouter();
  // const { data: listing } = useSWR(query?.id && `/api/listings/${query?.id}`);

  const listing: ListingEntity = {
    id: "1",
    name: "Steak & Fries With The Longest Name",
    price: 25,
    description: "Delicious saucy steak from the Gods.",
    image:
      "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    seller: "0x73421323hj2nhdjaknsd23x097adwawm920",
    items: [],
    userId: "somebodythatiusedtoknow",
    tokenId: 1,
    tokenContract: "0x923021032103312899dj201jj2390",
    createdAt: new Date(),
  };

  const listingTemplateProps = { seller: listing.seller, listing };

  return (
    <>
      <Head>
        <title>Listing | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <ListingTemplate {...listingTemplateProps} />
      </Layout>
    </>
  );
};

export default ListingPage;
