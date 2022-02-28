import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { readIPFSField } from "../utils/readIPFSField";

const TestPage: NextPage = () => {
  const imageSrc = readIPFSField({
    cid: "bafyreiekdkukksicijm2t43ceffxjkoobe2xix4szsdb6c7kl37wngyvly",
    property: "image",
  });

  return (
    <>
      <Head>
        <title>Test | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-row w-full h-screen items-center justify-center">
          <h1 className="text-xl"></h1>
          <img src={imageSrc} className="h-72 w-72" />
        </div>
      </Layout>
    </>
  );
};

export default TestPage;
