import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";

const ErrorPage: NextPage = () => (
  <>
    <Head>
      <title>Something Went Wrong | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <div className="flex flex-row items-center justify-center h-[80vh]">
        Something has gone terribly wrong.
      </div>
    </Layout>
  </>
);

export default ErrorPage;
