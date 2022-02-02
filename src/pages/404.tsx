import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";

const ErrorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          Something Went Wrong | {process.env.NEXT_PUBLIC_BRAND_NAME}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div>Something has gone terribly wrong.</div>
      </Layout>
    </>
  );
};

export default ErrorPage;
