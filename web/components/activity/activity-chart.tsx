"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ActivityChart() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transaction Analytics</CardTitle>
          <div className="flex items-center gap-2">
            <Select defaultValue="volume">
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volume (USDC)</SelectItem>
                <SelectItem value="count">Transaction Count</SelectItem>
                <SelectItem value="average">Average Value</SelectItem>
              </SelectContent>
            </Select>

            <Tabs defaultValue="line">
              <TabsList className="h-8">
                <TabsTrigger value="line" className="text-xs px-2">
                  Line
                </TabsTrigger>
                <TabsTrigger value="bar" className="text-xs px-2">
                  Bar
                </TabsTrigger>
                <TabsTrigger value="pie" className="text-xs px-2">
                  Pie
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Placeholder */}
        <div className="w-full h-64 bg-gray-50 border border-dashed border-gray-200 rounded-md flex items-center justify-center">
          <div className="text-muted-foreground text-sm">
            [Chart Visualization Area]
            <div className="text-xs text-center mt-2">Transaction volume over time would be displayed here</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
