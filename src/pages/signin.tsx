import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { SignIn } from "../components/SignIn";

const SignInPage: NextPage = () => (
  <>
    <Head>
      <title>Sign In | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <SignIn />
    </Layout>
  </>
);

export default SignInPage;
