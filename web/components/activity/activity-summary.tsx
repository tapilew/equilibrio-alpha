"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"

interface ActivitySummaryProps {
  totalTransactions: number
  totalVolume: number
  averageTransaction: number
  volumeChange: number
  transactionChange: number
  timeframe: "day" | "week" | "month" | "year"
  onTimeframeChange: (timeframe: "day" | "week" | "month" | "year") => void
}

export function ActivitySummary({
  totalTransactions = 0,
  totalVolume = 0,
  averageTransaction = 0,
  volumeChange = 0,
  transactionChange = 0,
  timeframe = "week",
  onTimeframeChange,
}: ActivitySummaryProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Activity Summary</CardTitle>
          <Tabs defaultValue={timeframe} onValueChange={(value) => onTimeframeChange(value as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="day" className="text-xs px-2">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-2">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2">
                Month
              </TabsTrigger>
              <TabsTrigger value="year" className="text-xs px-2">
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Total Volume</span>
            </div>
            <div className="text-2xl font-bold">{totalVolume} USDC</div>
            <div className={`text-xs flex items-center ${volumeChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {volumeChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(volumeChange)}% from previous {timeframe}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Transactions</span>
            </div>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <div className={`text-xs flex items-center ${transactionChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {transactionChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(transactionChange)}% from previous {timeframe}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Average Transaction</span>
            </div>
            <div className="text-2xl font-bold">{averageTransaction} USDC</div>
            <div className="text-xs text-muted-foreground">Per transaction</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Top Product</span>
            </div>
            <div className="text-lg font-bold">Ceramic Vase</div>
            <div className="text-xs text-muted-foreground">32 USDC × 5 units</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
