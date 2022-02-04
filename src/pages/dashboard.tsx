import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { Layout } from "../components/Layout";
import { SellerDashboard } from "../components/SellerDashboard";
import { ItemEntity, ListingEntity, ProtectedPage } from "../types";

interface Props {}

const DashboardPage: ProtectedPage<Props> = () => {
  const { data: listings } = useSWR<ListingEntity[]>("/api/listings");
  const { data: items } = useSWR<ItemEntity[]>("/api/items");

  const sellerDashboardProps = { listings, items };

  return (
    <>
      <Head>
        <title>Seller Dashboard | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SellerDashboard {...sellerDashboardProps} />
      </Layout>
    </>
  );
};

DashboardPage.isProtected = true;

export default DashboardPage;
