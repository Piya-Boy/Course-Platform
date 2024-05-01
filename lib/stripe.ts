import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRRIPE_API_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});
