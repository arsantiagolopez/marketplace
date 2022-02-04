import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { CreateListing } from "../../components/CreateListing";
import { Layout } from "../../components/Layout";
import { ItemEntity } from "../../types";

const CreateListingPage: NextPage = () => {
  const { data: items } = useSWR<ItemEntity[]>("/api/items");

  const createListingProps = { items };

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
