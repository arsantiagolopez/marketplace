import type { NextPage } from "next";
import Head from "next/head";
// import { useRouter } from "next/router";
import React from "react";
// import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { SellerTemplate } from "../../components/SellerTemplate";
import { SellerProfileEntity } from "../../types";

const SellerPage: NextPage = () => {
  // const { query } = useRouter();
  // const { data: listing } = useSWR<ListingEntity, any>(query?.address && `/api/sellers/${query?.address}`);

  const seller: SellerProfileEntity = {
    id: "1",
    name: "McDonalds",
    image:
      "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    userId: "1",
    address: "0x74A602830542b3e52ffCB5eb4bC902372a4fc076",
    createdAt: new Date(),
  };

  const sellerTemplateProps = { seller };

  return (
    <>
      <Head>
        <title>
          {seller?.name} | {process.env.NEXT_PUBLIC_BRAND_NAME}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SellerTemplate {...sellerTemplateProps} />
      </Layout>
    </>
  );
};

export default SellerPage;
