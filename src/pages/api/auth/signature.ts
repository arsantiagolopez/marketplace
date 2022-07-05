import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { UserEntity } from "../../../types";
import { Supabase } from "../../../utils/supabase";

/**
 * Create signature for wallet authentication.
 * @method POST /api/auth/signature
 * @return a string of the updated signature.
 */

export default async (
  { body }: NextApiRequest,
  res: NextApiResponse
): Promise<string | void> => {
  const { walletAddress } = body;

  const signature = v4();

  try {
    // Get signature from user that matches by wallet
    const { data, error } = await Supabase.from<UserEntity>("users")
      .select("signature")
      .match({ walletAddress });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // User doesn't exist, create one
    if (data && !data.length) {
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users`, {
        walletAddress,
        signature,
      });
    }
    // User exists, update existing user's signature
    else {
      await Supabase.from<UserEntity>("users")
        .update({ signature })
        .match({ walletAddress });
    }

    return res.status(200).json(signature);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};
