"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { ActivityItem } from "@/components/activity/activity-item"
import { ActivityFilters } from "@/components/activity/activity-filters"
import { ActivitySummary } from "@/components/activity/activity-summary"
import { ActivityChart } from "@/components/activity/activity-chart"
import { ActivityCategories } from "@/components/activity/activity-categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListFilter, BarChart2 } from "lucide-react"

export default function ActivityPage() {
  const [view, setView] = useState<"list" | "analytics">("list")
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">("week")
  const [filters, setFilters] = useState<string[]>([])

  // Sample data - in a real app, this would come from your API/blockchain events
  const activities = [
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
      metadata: {
        customerInfo: "Anonymous",
        products: [
          { name: "Ceramic Vase", quantity: 1, price: 32 },
          { name: "Woven Basket", quantity: 1, price: 25 },
        ],
        paymentMethod: "USDC Direct",
        tags: ["retail"],
      },
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
      metadata: {
        customerInfo: "Artisan Crafts Store",
        invoiceId: "INV-001",
        products: [
          { name: "Ceramic Vase", quantity: 1, price: 32 },
          { name: "Blue Pillow", quantity: 2, price: 22 },
        ],
        paymentMethod: "USDC Direct",
        notes: "Wholesale order for store display",
        tags: ["wholesale", "business"],
      },
    },
    {
      id: "tx3",
      type: "invoice" as const,
      amount: 35.75,
      source: "Invoice #INV-002",
      timestamp: "Apr 15, 09:15",
      status: "pending" as const,
      network: "BlockDAG",
      explorerUrl: "#",
      transactionHash: "0x6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
      metadata: {
        customerInfo: "john@example.com",
        invoiceId: "INV-002",
        products: [
          { name: "Cutting Board", quantity: 1, price: 18 },
          { name: "Woven Basket", quantity: 1, price: 25 },
        ],
        paymentMethod: "USDC Direct",
      },
    },
  ]

  const handleFilterChange = (newFilters: string[]) => {
    setFilters(newFilters)
    // In a real app, you would filter the activities based on these filters
  }

  const handleExport = () => {
    // In a real app, this would generate a CSV or PDF export
    alert("Exporting transaction data...")
  }

  const handleTagAdd = (id: string, tag: string) => {
    // In a real app, this would update the transaction metadata
    console.log(`Adding tag "${tag}" to transaction ${id}`)
  }

  const summaryData = {
    totalTransactions: 24,
    totalVolume: 750,
    averageTransaction: 31.25,
    volumeChange: 12.5,
    transactionChange: 8.3,
    timeframe: timeframe,
  }

  return (
    <AppShell>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Activity</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setView("list")}
            >
              <ListFilter className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={view === "analytics" ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setView("analytics")}
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
          </div>
        </div>

        {view === "list" ? (
          <>
            <ActivityFilters onFilterChange={handleFilterChange} onExport={handleExport} />

            <div className="space-y-3">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} {...activity} onTagAdd={handleTagAdd} />
              ))}
            </div>
          </>
        ) : (
          <>
            <ActivitySummary
              totalTransactions={summaryData.totalTransactions}
              totalVolume={summaryData.totalVolume}
              averageTransaction={summaryData.averageTransaction}
              volumeChange={summaryData.volumeChange}
              transactionChange={summaryData.transactionChange}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />

            <ActivityChart />

            <div className="grid md:grid-cols-2 gap-6">
              <ActivityCategories
                categories={[
                  { name: "Retail Sales", amount: 450, percentage: 60, color: "bg-blue-500" },
                  { name: "Wholesale", amount: 225, percentage: 30, color: "bg-green-500" },
                  { name: "Subscription", amount: 75, percentage: 10, color: "bg-purple-500" },
                ]}
                totalAmount={750}
              />

              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Products</CardTitle>
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
