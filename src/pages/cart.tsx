import Head from "next/head";
import React from "react";
import { CartTemplate } from "../components/CartTemplate";
import { Layout } from "../components/Layout";
import { ProtectedPage } from "../types";

interface Props {}

const CartPage: ProtectedPage<Props> = () => (
  <>
    <Head>
      <title>Cart | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <CartTemplate />
    </Layout>
  </>
);

CartPage.isProtected = true;

export default CartPage;
