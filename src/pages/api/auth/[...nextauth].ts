import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserEntity } from "../../../types";
import { Supabase } from "../../../utils/supabase";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          walletAddress: { type: "text" },
          signature: { type: "text" },
          rawSignature: { type: "text" },
        },
        // Handle wallet validation
        async authorize(credentials, _) {
          const { walletAddress, signature, rawSignature } = credentials!;

          const signedAddress = ethers.utils.verifyMessage(
            signature,
            rawSignature
          );

          // Wrong credentials
          if (signedAddress !== walletAddress) {
            return null;
          }

          // Get & return validated user
          let { data: user, error } = await Supabase.from<UserEntity>("users")
            .select("*")
            .match({ walletAddress, signature })
            .single();

          if (error) {
            console.log("Could not update user...");
            return null;
          }

          return user;
        },
      }),
    ],
    secret: process.env.SUPABASE_JWT_SECRET,
    jwt: {
      secret: process.env.SUPABASE_JWT_SECRET,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    callbacks: {
      session: async ({ session, token }) => {
        let user;

        let { data } = await Supabase.from<UserEntity>("users")
          .select(
            "walletAddress, name, isSeller, sellerProfile: sellerProfiles(name)"
          )
          .single();

        // Cookie not properly set, get user with token sub (userId)
        if (!data && token) {
          let { data: userData } = await Supabase.from<UserEntity>("users")
            .select(
              "name, walletAddress, isSeller, sellerProfile: sellerProfiles(name)"
            )
            .match({ id: token.sub })
            .single();

          data = userData;
        }

        const { sellerProfile, ...rest } = data as any;

        user = { ...rest };

        // Include store name if isSeller
        if (data?.isSeller && sellerProfile.length) {
          const { name } = sellerProfile[0];
          user = { ...rest, store: name };
        }

        return { ...session, user };
      },
    },
    pages: {
      signIn: "/signin",
      error: "/404", // Error code passed in query string as ?error=
    },
    debug: true,
  });
}
