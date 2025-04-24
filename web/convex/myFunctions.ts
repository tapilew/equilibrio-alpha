import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

// Product mutations
export const createProduct = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    description: v.optional(v.string()),
    stock: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
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

// Invoice APIs
export const createInvoice = mutation({
  args: {
    merchantId: v.string(),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      address: v.optional(v.string()),
    }),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      total: v.number(),
    })),
    subtotal: v.number(),
    tax: v.optional(v.number()),
    total: v.number(),
    dueDate: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const paymentRequestId = crypto.randomUUID();
    const invoiceId = await ctx.db.insert("invoices", {
      ...args,
      invoiceNumber: `INV-${Date.now()}`,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      paymentRequestId,
    });

    // Create status index
    await ctx.db.insert("invoiceStatusIndex", {
      invoiceId,
      status: "pending",
      merchantId: args.merchantId,
    });

    return invoiceId;
  },
});

export const getInvoices = query({
  args: {
    merchantId: v.string(),
    status: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("invoiceStatusIndex")
      .filter((q) => q.eq(q.field("merchantId"), args.merchantId));

    if (args.status) {
      q = q.filter((q) => q.eq(q.field("status"), args.status));
    }

    const indexes = await q.collect();
    const invoiceIds = indexes.map((idx) => idx.invoiceId);

    const invoices = await Promise.all(
      invoiceIds.map((id) => ctx.db.get(id)),
    );

    return invoices.filter((inv) => {
      if (!inv) return false;
      if (args.startDate && inv.createdAt < args.startDate) return false;
      if (args.endDate && inv.createdAt > args.endDate) return false;
      return true;
    });
  },
});

// POS Sale APIs
export const createPosSale = mutation({
  args: {
    merchantId: v.string(),
    items: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      total: v.number(),
    })),
    total: v.number(),
    customerInfo: v.optional(v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const paymentRequestId = crypto.randomUUID();
    const posSaleId = await ctx.db.insert("posSales", {
      ...args,
      saleNumber: `POS-${Date.now()}`,
      status: "pending",
      createdAt: Date.now(),
      paymentRequestId,
    });

    // Create status index
    await ctx.db.insert("posSaleStatusIndex", {
      posSaleId,
      status: "pending",
      merchantId: args.merchantId,
    });

    return posSaleId;
  },
});

// Payment Event Handler
export const handlePaymentProcessed = mutation({
  args: {
    txHash: v.string(),
    blockNumber: v.number(),
    timestamp: v.number(),
    merchantAddress: v.string(),
    payerAddress: v.string(),
    amount: v.number(),
    tokenAddress: v.string(),
    chainId: v.number(),
    network: v.string(),
    paymentRequestId: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert payment record
    const paymentId = await ctx.db.insert("payments", {
      ...args,
      status: "confirmed",
      createdAt: Date.now(),
    });

    // Create payment index
    await ctx.db.insert("paymentIndex", {
      paymentId,
      paymentRequestId: args.paymentRequestId,
      merchantAddress: args.merchantAddress,
    });

    // Find and update matching invoice
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("paymentRequestId"), args.paymentRequestId))
      .first();

    if (invoice) {
      await ctx.db.patch(invoice._id, {
        status: "paid",
        paymentId,
        updatedAt: Date.now(),
      });
      await ctx.db.patch(
        (await ctx.db
          .query("invoiceStatusIndex")
          .filter((q) => q.eq(q.field("invoiceId"), invoice._id))
          .first())!._id,
        { status: "paid" },
      );
    }

    // Find and update matching POS sale
    const posSale = await ctx.db
      .query("posSales")
      .filter((q) => q.eq(q.field("paymentRequestId"), args.paymentRequestId))
      .first();

    if (posSale) {
      await ctx.db.patch(posSale._id, {
        status: "paid",
        paymentId,
      });
      await ctx.db.patch(
        (await ctx.db
          .query("posSaleStatusIndex")
          .filter((q) => q.eq(q.field("posSaleId"), posSale._id))
          .first())!._id,
        { status: "paid" },
      );
    }

    return paymentId;
  },
});

// Receipt APIs
export const getReceipts = query({
  args: {
    merchantId: v.string(),
    type: v.optional(v.string()), // 'invoice' or 'pos'
    status: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const receipts = [];

    // Get invoices
    if (!args.type || args.type === "invoice") {
      const invoices = await ctx.db
        .query("invoiceStatusIndex")
        .filter((q) => q.eq(q.field("merchantId"), args.merchantId))
        .collect();

      for (const idx of invoices) {
        const invoice = await ctx.db.get(idx.invoiceId);
        if (!invoice) continue;
        if (args.status && invoice.status !== args.status) continue;
        if (args.startDate && invoice.createdAt < args.startDate) continue;
        if (args.endDate && invoice.createdAt > args.endDate) continue;

        receipts.push({
          type: "invoice",
          ...invoice,
        });
      }
    }

    // Get POS sales
    if (!args.type || args.type === "pos") {
      const posSales = await ctx.db
        .query("posSaleStatusIndex")
        .filter((q) => q.eq(q.field("merchantId"), args.merchantId))
        .collect();

      for (const idx of posSales) {
        const posSale = await ctx.db.get(idx.posSaleId);
        if (!posSale) continue;
        if (args.status && posSale.status !== args.status) continue;
        if (args.startDate && posSale.createdAt < args.startDate) continue;
        if (args.endDate && posSale.createdAt > args.endDate) continue;

        receipts.push({
          type: "pos",
          ...posSale,
        });
      }
    }

    return receipts.sort((a, b) => b.createdAt - a.createdAt);
  },
});
