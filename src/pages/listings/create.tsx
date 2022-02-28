import Head from "next/head";
import React from "react";
import { CreateListing } from "../../components/CreateListing";
import { Layout } from "../../components/Layout";
import { ProtectedPage } from "../../types";

interface Props {}

const CreateListingPage: ProtectedPage<Props> = () => (
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

CreateListingPage.isProtected = true;

export default CreateListingPage;
