import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { CreateItem } from "../../components/CreateItem";
import { Layout } from "../../components/Layout";

const CreateItemPage: NextPage = () => {
  const { data: items } = useSWR("/api/items");

  const createItemProps = { items };

  return (
    <>
      <Head>
        <title>Create An Item | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <CreateItem {...createItemProps} />
      </Layout>
    </>
  );
};

export default CreateItemPage;
