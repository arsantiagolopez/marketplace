import type { NextApiRequest, NextApiResponse } from "next";
import { UserEntity } from "../../../types";
import { getUserId } from "../../../utils/getUserId";
import { Supabase } from "../../../utils/supabase";

/**
 * Get all my listings.
 * @method GET /api/listings
 * @returns an array of objects of listings.
 */
const getMyListings = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<UserEntity | void> => {
  try {
    const userId = await getUserId({ req });

    if (!userId) {
      return res.status(400).json({
        error: "Must be authenticated to get your user.",
      });
    }

    let { data: user, error } = await Supabase.from<UserEntity>("users")
      .select("name, walletAddress, isSeller, sellerProfiles(name)")
      .match({ id: userId })
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { sellerProfiles, ...rest } = user as any;

    if (sellerProfiles) {
      user = { ...rest, store: sellerProfiles[0].name };
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

/**
 * Create a listing record.
 * @method POST /api/listings
 * @returns an object of the created listing.
 */
const createListing = async (
  { body }: NextApiRequest,
  res: NextApiResponse
): Promise<UserEntity | void> => {
  const { walletAddress, ...fields } = body;

  try {
    const { data: user, error } = await Supabase.from<UserEntity>("users")
      .insert({
        walletAddress,
        ...fields,
      })
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return getMyListings(req, res);
    case "POST":
      return createListing(req, res);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
