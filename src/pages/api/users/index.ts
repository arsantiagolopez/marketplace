import type { NextApiRequest, NextApiResponse } from "next";
import { UserEntity } from "../../../types";
import { getUserId } from "../../../utils/getUserId";
import { Supabase } from "../../../utils/supabase";

/**
 * Get my user record.
 * @method GET /api/users
 * @returns an object of a user record.
 */
const getUser = async (
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
 * Create a user record.
 * @method POST /api/users
 * @returns an object of the created user.
 */
const createUser = async (
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

/**
 * Update your own user record.
 * @method PUT /api/users
 * @returns an object of the updated user.
 */
const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<UserEntity | void> => {
  const { body } = req;

  try {
    const userId = await getUserId({ req });

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Must be authenticated to update your profile." });
    }

    const { data: user, error } = await Supabase.from<UserEntity>("users")
      .update({ ...body })
      .match({ id: userId })
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
      return getUser(req, res);
    case "POST":
      return createUser(req, res);
    case "PUT":
      return updateUser(req, res);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
