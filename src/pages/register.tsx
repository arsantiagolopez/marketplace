import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";
import { UserSession } from "../types";

interface Session {
  data: UserSession;
}

const RegisterPage: NextPage = () => {
  const { data: session } = useSession() as unknown as Session;

  const registerFormProps = { session };

  return (
    <>
      <Head>
        <title>Register | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <RegisterForm {...registerFormProps} />
      </Layout>
    </>
  );
};

export default RegisterPage;
