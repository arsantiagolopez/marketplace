import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { ListingTemplate } from "../../components/ListingTemplate";
import {
  ListingEntity,
  ProtectedPage,
  SellerProfileEntity,
  UserSession,
} from "../../types";

interface Props {}

interface Session {
  data: UserSession;
}

const ListingPage: ProtectedPage<Props> = () => {
  const { query } = useRouter();
  const { data: listing, mutate } = useSWR<ListingEntity, any>(
    query?.id && `/api/listings/${query?.id}`
  );
  const { data: sellerProfile } = useSWR<SellerProfileEntity, any>(
    listing && `/api/sellers/${listing?.sellerAddress}`
  );
  const { data: session } = useSession() as unknown as Session;

  const listingTemplateProps = { session, sellerProfile, listing, mutate };

  return (
    <>
      <Head>
        <title>Listing | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <ListingTemplate {...listingTemplateProps} />
      </Layout>
    </>
  );
};

ListingPage.isProtected = true;

export default ListingPage;
