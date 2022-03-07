import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { SellerTemplate } from "../../components/SellerTemplate";
import { ProtectedPage, SellerProfileEntity } from "../../types";

interface Props {}

const SellerPage: ProtectedPage<Props> = () => {
  const { query } = useRouter();
  const { data: sellerProfile } = useSWR<SellerProfileEntity, any>(
    query && `/api/sellers/${query?.address}`
  );

  const sellerTemplateProps = { sellerProfile };

  return (
    <>
      <Head>
        <title>
          {sellerProfile?.name} | {process.env.NEXT_PUBLIC_BRAND_NAME}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SellerTemplate {...sellerTemplateProps} />
      </Layout>
    </>
  );
};

SellerPage.isProtected = true;

export default SellerPage;
