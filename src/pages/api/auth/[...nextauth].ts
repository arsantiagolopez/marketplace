import { ethers } from "ethers";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserEntity } from "../../../types";
import { Supabase } from "../../../utils/supabase";

export default NextAuth({
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
    session: async ({ session }) => {
      let user;

      const { data } = await Supabase.from("users")
        .select("walletAddress, name, isSeller, sellerProfiles(name)")
        .single();

      const { sellerProfiles, ...rest } = data;

      user = { ...rest };

      // Include store name if isSeller
      if (data?.isSeller) {
        const { name } = sellerProfiles[0];
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
