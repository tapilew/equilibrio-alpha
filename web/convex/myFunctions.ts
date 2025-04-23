import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// Product queries
export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Cart mutations
export const addToCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");

    // Check if item already in cart
    const existingItem = await ctx.db
      .query("cartItems")
      .filter((q) =>
        q.eq(q.field("userId"), args.userId) &&
        q.eq(q.field("productId"), args.productId)
      )
      .first();

    if (existingItem) {
      // Update quantity
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
      return existingItem._id;
    }

    // Add new item
    return await ctx.db.insert("cartItems", {
      userId: args.userId,
      productId: args.productId,
      quantity: args.quantity,
      price: product.price,
    });
  },
});

export const updateCartItemQuantity = mutation({
  args: {
    cartItemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.cartItemId, {
      quantity: args.quantity,
    });
  },
});

export const removeFromCart = mutation({
  args: {
    cartItemId: v.id("cartItems"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.cartItemId);
  },
});

// Cart queries
export const getCartItems = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cartItems")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Fetch product details for each cart item
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      }),
    );

    return itemsWithProducts;
  },
});

// Order mutations
export const createOrder = mutation({
  args: {
    userId: v.string(),
    paymentAddress: v.string(),
  },
  handler: async (ctx, args) => {
    // Get cart items
    const cartItems = await ctx.db
      .query("cartItems")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      status: "pending",
      paymentAddress: args.paymentAddress,
      createdAt: Date.now(),
    });

    // Clear cart
    await Promise.all(
      cartItems.map((item) => ctx.db.delete(item._id)),
    );

    return orderId;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    paymentHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      ...(args.paymentHash && { paymentHash: args.paymentHash }),
    });
  },
});

// Order queries
export const getOrder = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const getUserOrders = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});
