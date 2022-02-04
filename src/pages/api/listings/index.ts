import type { NextApiRequest, NextApiResponse } from "next";
import {
  ItemPriceEntity,
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
      .select("*, listingPrices(selectCurrency, usd, eth, lockedEthRate)")
      .match({ userId });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // User does not have any listings
    if (data && !data.length) {
      return null;
    }

    for (let listing of data!) {
      const { listingPrices, ...rest } = listing;
      listing = {
        ...rest,
        prices: listingPrices ? listingPrices[0] : undefined,
      };
      listings.push(listing);
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
  const { items, prices, currency, ...rest } = body;

  let totalPrices: ItemPriceEntity[] = [];
  let finalListingPrice: ListingPriceEntity | undefined;

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

    const { data: listing, error } = await Supabase.from<ListingEntity>(
      "listings"
    )
      .insert({ ...rest, sellerAddress: userId, userId })
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // ListingItems (many to many)
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

      // Add item price to total items price
      totalPrices.push(item.prices);
    }

    // Calculate final price for listing

    // Get submitted listing price currency and ethRate
    const {
      selectCurrency, // Preferred currency on listing submission
      lockedEthRate, // ETH rate at time of submission
    } = prices as ListingPriceEntity;

    // Iterate through all prices and sum based on currency and ETH rate
    finalListingPrice = totalPrices.reduce((accumulator, price) => {
      let {
        usd,
        eth,
        selectCurrency: itemSelectCurrency,
      } = price as ItemPriceEntity;

      // Guarantee locked rates on select currencies of items
      if (itemSelectCurrency === "USD") {
        eth = (usd / parseFloat(lockedEthRate)).toString();
      }
      if (itemSelectCurrency === "ETH") {
        usd = parseFloat(eth) * parseFloat(lockedEthRate);
      }

      // Sum with total
      usd += accumulator.usd;
      eth = (parseFloat(eth) + parseFloat(accumulator.eth)).toString();

      return {
        selectCurrency,
        lockedEthRate,
        usd,
        eth,
      };
    }, prices);

    const { error: priceError } = await Supabase.from<ListingPriceEntity>(
      "listingPrices"
    )
      .insert({
        ...finalListingPrice,
        listingId: listing?.id,
      })
      .single();

    if (priceError) {
      return res.status(400).json({ error: priceError.message });
    }

    return res.status(200).json(listing);
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
