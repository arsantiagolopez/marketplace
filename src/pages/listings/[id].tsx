import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { getListingById } from "../../blockchain/Marketplace/getListingById";
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
  const [listing, setListing] = useState<ListingEntity | undefined>();
  const { query } = useRouter();
  const { data: sellerProfile } = useSWR<SellerProfileEntity, any>(
    listing && `/api/sellers/${listing?.token.seller}`
  );
  const { data: session } = useSession() as unknown as Session;

  const listingTemplateProps = { session, sellerProfile, listing };

  // Fetch listing from contract
  const fetchListingById = async (id: number) => {
    const data = await getListingById(id);
    setListing(data);
  };

  useEffect(() => {
    fetchListingById(Number(query?.id));
  }, [query]);

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
