import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { Layout } from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";
import { UserEntity, UserSession } from "../types";

interface Session {
  data: UserSession;
}

const RegisterPage: NextPage = () => {
  const { data: user, mutate } = useSWR<UserEntity, any>("/api/users");

  const registerFormProps = { user, mutate };

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
