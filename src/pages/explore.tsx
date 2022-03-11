import Head from "next/head";
import React from "react";
import { Explore } from "../components/Explore";
import { Layout } from "../components/Layout";
import { ProtectedPage } from "../types";

interface Props {}

const ExplorePage: ProtectedPage<Props> = () => (
  <>
    <Head>
      <title>Explore | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <Explore />
    </Layout>
  </>
);

ExplorePage.isProtected = true;

export default ExplorePage;
