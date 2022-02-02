import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { Marketplace } from "../components/Marketplace";

const ExplorePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Explore | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Marketplace />
      </Layout>
    </>
  );
};

export default ExplorePage;
