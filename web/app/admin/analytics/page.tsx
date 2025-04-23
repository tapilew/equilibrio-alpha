import { ActivityChart } from "@/components/activity/activity-chart";
import { ActivityCategories } from "@/components/activity/activity-categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAnalyticsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights into your business performance
        </p>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ActivityChart />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <ActivityCategories
          categories={[
            {
              name: "Retail Sales",
              amount: 450,
              percentage: 60,
              color: "bg-blue-500",
            },
            {
              name: "Wholesale",
              amount: 225,
              percentage: 30,
              color: "bg-green-500",
            },
            {
              name: "Subscription",
              amount: 75,
              percentage: 10,
              color: "bg-purple-500",
            },
          ]}
          totalAmount={750}
        />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sales by Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">BlockDAG</span>
                </div>
                <span>525 USDC (70%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">Celo</span>
                </div>
                <span>225 USDC (30%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
