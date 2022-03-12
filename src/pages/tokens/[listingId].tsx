import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getListingById } from "../../blockchain/Marketplace/getListingById";
import { Layout } from "../../components/Layout";
import { TokenTemplate } from "../../components/TokenTemplate";
import { ListingEntity, ProtectedPage, UserSession } from "../../types";
import { useEthPrice } from "../../utils/useEthPrice";

interface Props {}

interface Session {
  data: UserSession;
}

const TokenPage: ProtectedPage<Props> = () => {
  const [listing, setListing] = useState<ListingEntity | undefined>();
  const { query } = useRouter();
  const { data: session } = useSession() as unknown as Session;

  const tokensTemplateProps = { session, listing };

  const { ethRate } = useEthPrice();

  // Fetch listing from contract
  const fetchListingById = async (id: number, rate: string) => {
    try {
      const data = await getListingById(id, rate);
      setListing(data);
    } catch {
      console.log("Could not fetch listing.");
    }
  };

  useEffect(() => {
    if (ethRate) {
      fetchListingById(Number(query?.listingId), ethRate);
    }
  }, [query, ethRate]);

  return (
    <>
      <Head>
        <title>
          {listing?.name} | {process.env.NEXT_PUBLIC_BRAND_NAME}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <TokenTemplate {...tokensTemplateProps} />
      </Layout>
    </>
  );
};

TokenPage.isProtected = true;

export default TokenPage;
