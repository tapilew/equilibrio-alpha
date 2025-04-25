"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { ActivityItem } from "@/components/activity/activity-item";

// TODO: Replace mock data and interface with data from Convex `getReceipts` query
interface Receipt {
  id: string;
  type: "pos" | "invoice";
  amount: number;
  source: string;
  timestamp: string;
  status: "confirmed" | "pending" | "failed";
  network: string;
  explorerUrl?: string;
  transactionHash?: string;
  metadata?: {
    customerInfo?: string;
    invoiceId?: string;
    productIds?: string[];
    products?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    paymentMethod?: string;
    notes?: string;
    tags?: string[];
  };
}

export default function AdminReceiptsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for receipts - needs replacement with actual data
  const receipts: Receipt[] = [
    {
      id: "tx1",
      type: "pos",
      amount: 12.5,
      source: "POS Sale",
      timestamp: "Today, 14:53",
      status: "confirmed",
      network: "BlockDAG",
      explorerUrl: "#",
      transactionHash: "0x8f6e5d4c3b2a1908f7e6d5c4b3a2190",
      metadata: {
        customerInfo: "John Doe",
        products: [{ name: "Ceramic Vase", quantity: 1, price: 12.5 }],
        paymentMethod: "USDC Direct",
        tags: ["retail", "in-store"],
      },
    },
    {
      id: "tx2",
      type: "invoice",
      amount: 57,
      source: "Invoice #INV-001",
      timestamp: "Yesterday, 10:22",
      status: "confirmed",
      network: "BlockDAG",
      explorerUrl: "#",
      transactionHash: "0x7d8e9f2c1b3a4908d7e6c5b4a3219",
      metadata: {
        customerInfo: "Jane Smith",
        products: [
          { name: "Woven Basket", quantity: 2, price: 25 },
          { name: "Blue Pillow", quantity: 1, price: 7 },
        ],
        paymentMethod: "USDC Direct",
        tags: ["wholesale"],
      },
    },
    {
      id: "tx3",
      type: "pos",
      amount: 32.5,
      source: "POS Sale",
      timestamp: "Yesterday, 09:15",
      status: "confirmed",
      network: "BlockDAG",
      explorerUrl: "#",
      transactionHash: "0x6c5b4a3219d7e8f2c1b3a4908",
      metadata: {
        customerInfo: "Anonymous",
        products: [{ name: "Ceramic Vase", quantity: 1, price: 32.5 }],
        paymentMethod: "USDC Direct",
        tags: ["retail", "in-store"],
      },
    },
  ];

  // Filter receipts based on search query
  const filteredReceipts = receipts.filter((receipt) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      receipt.source.toLowerCase().includes(searchLower) ||
      receipt.metadata?.customerInfo?.toLowerCase().includes(searchLower) ||
      receipt.metadata?.products?.some((product) =>
        product.name.toLowerCase().includes(searchLower),
      ) ||
      receipt.transactionHash?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Receipts</h1>
        <p className="text-muted-foreground">
          View and manage your transaction receipts
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receipts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredReceipts.map((receipt) => (
          <ActivityItem key={receipt.id} {...receipt} />
        ))}
      </div>

      {filteredReceipts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No receipts found</p>
        </div>
      )}
    </>
  );
}
