import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { CreateItem } from "../../components/CreateItem";
import { Layout } from "../../components/Layout";
import { ProtectedPage, UserSession } from "../../types";

interface Props {}

interface Session {
  data: UserSession;
}

const CreateItemPage: ProtectedPage<Props> = () => {
  const { data: session } = useSession() as unknown as Session;

  const createItemProps = { session };

  return (
    <>
      <Head>
        <title>Create An Item | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <CreateItem {...createItemProps} />
      </Layout>
    </>
  );
};

CreateItemPage.isProtected = true;

export default CreateItemPage;
