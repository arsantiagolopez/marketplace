import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";

const RegisterPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <RegisterForm />
      </Layout>
    </>
  );
};

export default RegisterPage;
