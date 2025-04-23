"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Category {
  name: string
  amount: number
  percentage: number
  color: string
}

interface ActivityCategoriesProps {
  categories: Category[]
  totalAmount: number
}

export function ActivityCategories({
  categories = [
    { name: "Retail Sales", amount: 450, percentage: 60, color: "bg-blue-500" },
    { name: "Wholesale", amount: 225, percentage: 30, color: "bg-green-500" },
    { name: "Subscription", amount: 75, percentage: 10, color: "bg-purple-500" },
  ],
  totalAmount = 750,
}: ActivityCategoriesProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Transaction Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-sm font-medium">{category.amount} USDC</div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={category.percentage} className="h-2" />
                <span className="text-xs text-muted-foreground">{category.percentage}%</span>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t mt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold">{totalAmount} USDC</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
