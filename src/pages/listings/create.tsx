import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { CreateListing } from "../../components/CreateListing";
import { Layout } from "../../components/Layout";

const CreateListingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create A Listing | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <CreateListing />
      </Layout>
    </>
  );
};

export default CreateListingPage;
