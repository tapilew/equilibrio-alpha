"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitySummary } from "@/components/activity/activity-summary";
import { ActivityChart } from "@/components/activity/activity-chart";
import { ActivityItem } from "@/components/activity/activity-item";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminConnectedAddress } = useWalletConnection();

  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">(
    "week",
  );

  const summaryData = {
    totalTransactions: 24,
    totalVolume: 750,
    averageTransaction: 31.25,
    volumeChange: 12.5,
    transactionChange: 8.3,
    timeframe: timeframe,
  };

  const recentActivities = [
    {
      id: "tx1",
      type: "pos" as const,
      amount: 12.5,
      source: "POS Sale",
      timestamp: "Today, 14:53",
      status: "confirmed" as const,
      network: "BlockDAG",
      explorerUrl: "#",
      transactionHash: "0x8f6e5d4c3b2a1908f7e6d5c4b3a2190",
    },
    {
      id: "tx2",
      type: "invoice" as const,
      amount: 57,
      source: "Invoice #INV-001",
      timestamp: "Yesterday, 10:22",
      status: "confirmed" as const,
      network: "BlockDAG",
      explorerUrl: "#",
      transactionHash: "0x7d8e9f2c1b3a4908d7e6c5b4a3219",
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Showing data for wallet: {adminConnectedAddress?.slice(0, 6)}...
          {adminConnectedAddress?.slice(-4)}
        </p>
      </div>

      <ActivitySummary
        totalTransactions={summaryData.totalTransactions}
        totalVolume={summaryData.totalVolume}
        averageTransaction={summaryData.averageTransaction}
        volumeChange={summaryData.volumeChange}
        transactionChange={summaryData.transactionChange}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} {...activity} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity for this wallet.
                </p>
              )}
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => router.push("/admin/receipts")}
                >
                  View All Receipts <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Products (Example)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Ceramic Vase</span>
                <span>160 USDC (5 units)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Woven Basket</span>
                <span>125 USDC (5 units)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Blue Pillow</span>
                <span>88 USDC (4 units)</span>
              </div>
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => router.push("/admin/products")}
                >
                  View All Products <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ActivityChart />
    </>
  );
}
