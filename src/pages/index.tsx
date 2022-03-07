import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Explore } from "../components/Explore";
import { Landing } from "../components/Landing";
import { Layout } from "../components/Layout";

const IndexPage: NextPage = () => {
  const { data: session, status } = useSession();

  const authenticated = session && status !== "loading";
  const title = authenticated ? "Explore" : "Marketplace";

  if (status !== "loading") {
    return (
      <>
        <Head>
          <title>
            {title} | {process.env.NEXT_PUBLIC_BRAND_NAME}
          </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>{authenticated ? <Explore /> : <Landing />}</Layout>
      </>
    );
  }

  return <></>;
};

export default IndexPage;
