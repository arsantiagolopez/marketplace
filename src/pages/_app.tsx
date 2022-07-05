import axios from "axios";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps as NextAppProps } from "next/app";
import { SWRConfig } from "swr";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { CartProvider } from "../context/CartProvider";
import { PreferencesProvider } from "../context/PreferencesProvider";
import "../styles/globals.css";

interface IsProtectedProp {
  isProtected?: boolean;
  isSeller?: boolean;
}

// Custom type to override Component type
type AppProps<P = any> = {
  Component: NextComponentType<NextPageContext, any, {}> & IsProtectedProp;
} & Omit<NextAppProps<P>, "Component">;

const MyApp: NextPage<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <SWRConfig
      value={{
        fetcher: (url) => axios(url).then((res) => res.data),
      }}
    >
      <PreferencesProvider>
        <CartProvider>
          {Component.isProtected ? (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </CartProvider>
      </PreferencesProvider>
    </SWRConfig>
  </SessionProvider>
);

export default MyApp;
