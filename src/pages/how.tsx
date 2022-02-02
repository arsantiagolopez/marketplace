import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";

const HowPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>How It Works | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <>How it works</>
      </Layout>
    </>
  );
};

export default HowPage;
