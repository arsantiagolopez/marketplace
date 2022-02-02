import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { CreateItem } from "../../components/CreateItem";
import { Layout } from "../../components/Layout";

const CreateItemPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create An Item | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <CreateItem />
      </Layout>
    </>
  );
};

export default CreateItemPage;
