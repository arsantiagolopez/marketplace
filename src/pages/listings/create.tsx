import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { CreateListing } from "../../components/CreateListing";
import { Layout } from "../../components/Layout";
import { ProtectedPage, UserSession } from "../../types";

interface Props {}

interface Session {
  data: UserSession;
}

const CreateListingPage: ProtectedPage<Props> = () => {
  const { data: session } = useSession() as unknown as Session;

  const createItemProps = { session };

  return (
    <>
      <Head>
        <title>Create A Listing | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <CreateListing {...createItemProps} />
      </Layout>
    </>
  );
};

CreateListingPage.isProtected = true;

export default CreateListingPage;
