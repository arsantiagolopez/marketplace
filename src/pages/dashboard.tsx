import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { SellerDashboard } from "../components/SellerDashboard";
import { ProtectedPage } from "../types";

interface Props {}

const DashboardPage: ProtectedPage<Props> = () => (
  <>
    <Head>
      <title>Seller Dashboard | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <SellerDashboard />
    </Layout>
  </>
);

DashboardPage.isProtected = true;

export default DashboardPage;
