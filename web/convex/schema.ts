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

  // New tables for invoicing and payments
  invoices: defineTable({
    merchantId: v.string(), // ID of the merchant who created the invoice
    invoiceNumber: v.string(), // Unique invoice identifier
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
    status: v.string(), // 'draft', 'pending', 'paid', 'overdue', 'cancelled'
    dueDate: v.number(), // Unix timestamp
    createdAt: v.number(),
    updatedAt: v.number(),
    paymentId: v.optional(v.id("payments")), // Link to payment record if paid
    paymentRequestId: v.string(), // Unique ID for payment matching
    notes: v.optional(v.string()),
  }),

  posSales: defineTable({
    merchantId: v.string(),
    saleNumber: v.string(), // Unique POS sale identifier
    items: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      total: v.number(),
    })),
    total: v.number(),
    status: v.string(), // 'pending', 'paid', 'cancelled'
    createdAt: v.number(),
    paymentId: v.optional(v.id("payments")), // Link to payment record if paid
    paymentRequestId: v.string(), // Unique ID for payment matching
    customerInfo: v.optional(v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
    })),
  }),

  payments: defineTable({
    txHash: v.string(), // Blockchain transaction hash
    blockNumber: v.number(),
    timestamp: v.number(),
    merchantAddress: v.string(),
    payerAddress: v.string(),
    amount: v.number(),
    tokenAddress: v.string(),
    chainId: v.number(),
    network: v.string(),
    paymentRequestId: v.string(), // Used to match with invoice/posSale
    status: v.string(), // 'confirmed', 'failed'
    createdAt: v.number(),
  }),

  // Index for faster queries
  invoiceStatusIndex: defineTable({
    invoiceId: v.id("invoices"),
    status: v.string(),
    merchantId: v.string(),
  }),

  posSaleStatusIndex: defineTable({
    posSaleId: v.id("posSales"),
    status: v.string(),
    merchantId: v.string(),
  }),

  paymentIndex: defineTable({
    paymentId: v.id("payments"),
    paymentRequestId: v.string(),
    merchantAddress: v.string(),
  }),
});
