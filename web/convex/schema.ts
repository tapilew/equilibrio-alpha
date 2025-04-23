import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  products: defineTable({
    name: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    description: v.optional(v.string()),
    stock: v.number(),
  }),

  cartItems: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
    price: v.number(), // Price at time of adding to cart
  }),

  orders: defineTable({
    userId: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      price: v.number(),
    })),
    total: v.number(),
    status: v.string(), // 'pending', 'paid', 'completed', 'cancelled'
    paymentAddress: v.string(),
    paymentHash: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
