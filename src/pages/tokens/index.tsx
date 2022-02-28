import Head from "next/head";
import React from "react";
import { Layout } from "../../components/Layout";
import { Tokens } from "../../components/Tokens";
import { ProtectedPage } from "../../types";

interface Props {}

const TokensPage: ProtectedPage<Props> = () => (
  <>
    <Head>
      <title>My Items | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <Tokens />
    </Layout>
  </>
);

TokensPage.isProtected = true;

export default TokensPage;
