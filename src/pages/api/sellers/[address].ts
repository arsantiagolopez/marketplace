import type { NextApiRequest, NextApiResponse } from "next";
import { SellerProfileEntity } from "../../../types";
import { Supabase } from "../../../utils/supabase";

/**
 * Get seller profile by wallet address.
 * @mathod GET /api/sellers/[address]
 * @returns an object of the seller profile.
 */
const getSellerByAddress = async (
  { query }: NextApiRequest,
  res: NextApiResponse
): Promise<SellerProfileEntity | null | void> => {
  const { address } = query;

  let profile: SellerProfileEntity | null = null;

  try {
    const { data, error } = await Supabase.from<SellerProfileEntity>(
      "sellerProfiles"
    )
      .select("*")
      .match({ address });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // User does not have a seller profile
    if (data && !data.length) {
      return null;
    }

    if (data) {
      profile = data[0];
    }

    return res.status(200).json(profile);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return getSellerByAddress(req, res);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
