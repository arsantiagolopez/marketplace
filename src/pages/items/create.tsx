import Head from "next/head";
import React from "react";
import { CreateItem } from "../../components/CreateItem";
import { Layout } from "../../components/Layout";
import { ProtectedPage } from "../../types";

interface Props {}

const CreateItemPage: ProtectedPage<Props> = () => (
  <>
    <Head>
      <title>Create An Item | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <CreateItem />
    </Layout>
  </>
);

CreateItemPage.isProtected = true;

export default CreateItemPage;
