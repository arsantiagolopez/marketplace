import type { NextApiRequest, NextApiResponse } from "next";
import {
  ListingEntity,
  ListingItemEntity,
  ListingPriceEntity,
} from "../../../types";
import { getUserSessionAndId } from "../../../utils/getUserSessionAndId";
import { Supabase } from "../../../utils/supabase";

/**
 * Get all my listings.
 * @method GET /api/listings
 * @returns an array of objects of listings.
 */
const getMyListings = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ListingEntity[] | null | void> => {
  let listings: ListingEntity[] = [];

  try {
    const { userId } = (await getUserSessionAndId({ req })) || {};

    if (!userId) {
      return res.status(400).json({
        error: "Must be authenticated to get your user.",
      });
    }

    let { data, error } = await Supabase.from<ListingEntity>("listings")
      .select(
        `*, price: listingPrices(selectCurrency, usd, eth, lockedEthRate)`
      )
      .match({ userId });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // User does not have any listings
    if (data && !data.length) {
      return null;
    }

    if (data) {
      for (let listing of data!) {
        const { price, ...rest } = listing as any;
        listing = { ...rest, price: price[0] };
        listings.push(listing);
      }
    }

    return res.status(200).json(listings);
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
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ListingEntity | void> => {
  const { body } = req;
  let { items, prices, currency, ...rest } = body;

  try {
    const { userId, session } = (await getUserSessionAndId({ req })) || {};

    if (!userId) {
      return res.status(400).json({
        error: "Must be authenticated to create a listing.",
      });
    }

    if (!session?.user?.isSeller) {
      return res.status(400).json({
        error: "Must be a seller to create a listing.",
      });
    }

    // Create listing entity
    const { data: listing, error } = await Supabase.from<ListingEntity>(
      "listings"
    )
      .insert({ ...rest, sellerAddress: session?.user?.walletAddress, userId })
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Create listingPrice entity
    const { error: priceError } = await Supabase.from<ListingPriceEntity>(
      "listingPrices"
    )
      .insert({ ...prices, listingId: listing?.id })
      .single();

    if (priceError) {
      return res.status(400).json({ error: priceError.message });
    }

    // Create listingItem entities, if any selected
    for (const item of items) {
      const { error } = await Supabase.from<ListingItemEntity>("listingItems")
        .insert({
          itemId: item.id,
          listingId: listing?.id,
        })
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    return res.status(200).json(listing);
  } catch (err) {
    console.log(err);
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
