import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Internal mutation to seed products (run manually)
export const _seedProducts = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting product seeding...");

    // 1. Delete all existing products
    const existingProducts = await ctx.db.query("products").collect();
    console.log(
      `Found ${existingProducts.length} existing products to delete.`,
    );
    await Promise.all(existingProducts.map((doc) => ctx.db.delete(doc._id)));
    console.log("Existing products deleted.");

    // 2. Define the new products
    const newCraftProducts = [
      {
        name: "Handmade Clay Pot",
        price: 45,
        imageUrl:
          "https://images.pexels.com/photos/18882480/pexels-photo-18882480/free-photo-of-close-up-of-a-person-making-a-clay-pot.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&q=80",
        stock: 10,
        description: "A beautifully crafted clay pot, shaped by hand.",
      },
      {
        name: "Artisan Ceramic Teapot",
        price: 65,
        imageUrl:
          "https://images.pexels.com/photos/27682063/pexels-photo-27682063/free-photo-of-a-person-is-making-a-pottery-teapot.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&q=80",
        stock: 5,
        description:
          "Elegant ceramic teapot, perfect for a traditional tea ceremony.",
      },
      {
        name: "Sculpted Clay Vase",
        price: 50,
        imageUrl:
          "https://images.pexels.com/photos/6243368/pexels-photo-6243368.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&q=80",
        stock: 8,
        description:
          "Unique clay vase with intricate details, sculpted by an artisan.",
      },
      {
        name: "Detailed Pottery Jar",
        price: 55,
        imageUrl:
          "https://images.pexels.com/photos/9304555/pexels-photo-9304555.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&q=80",
        stock: 7,
        description: "A pottery jar showcasing detailed craftsmanship.",
      },
      {
        name: "Work-in-Progress Clay Pot",
        price: 30,
        imageUrl:
          "https://images.pexels.com/photos/20302786/pexels-photo-20302786/free-photo-of-close-up-of-a-person-making-a-handmade-clay-pot.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&q=80",
        stock: 12,
        description: "Handmade clay pot, captured during the creation process.",
      },
    ];

    // 3. Insert new products
    console.log(`Inserting ${newCraftProducts.length} new products...`);
    await Promise.all(
      newCraftProducts.map((product) => ctx.db.insert("products", product)),
    );

    console.log("Product seeding finished successfully.");
    return `Seeded ${newCraftProducts.length} products.`;
  },
});

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
