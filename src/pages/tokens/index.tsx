import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { Tokens } from "../../components/Tokens";
import { ItemEntity, ProtectedPage } from "../../types";

interface Props {}

const TokensPage: ProtectedPage<Props> = () => {
  const { data: tokens } = useSWR<ItemEntity[], any>("/api/items");

  const tokensProps = { tokens };

  return (
    <>
      <Head>
        <title>My Items | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Tokens {...tokensProps} />
      </Layout>
    </>
  );
};

TokensPage.isProtected = true;

export default TokensPage;
