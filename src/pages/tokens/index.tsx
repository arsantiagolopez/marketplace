import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { Tokens } from "../../components/Tokens";

const TokensPage: NextPage = () => {
  const { data: tokens } = useSWR("/api/items");

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

export default TokensPage;
