import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { CreateListing } from "../../components/CreateListing";
import { Layout } from "../../components/Layout";
import { ItemEntity, ListingEntity } from "../../types";

const CreateListingPage: NextPage = () => {
  const { data: items } = useSWR<ItemEntity[]>("/api/items");
  const { data: listings, mutate } = useSWR<ListingEntity[], any>(
    "/api/listings"
  );

  const createListingProps = { items, listings, mutate };

  return (
    <>
      <Head>
        <title>Create A Listing | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <CreateListing {...createListingProps} />
      </Layout>
    </>
  );
};

export default CreateListingPage;
