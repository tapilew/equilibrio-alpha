import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettingsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" defaultValue="Artisan Crafts" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="admin@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input id="address" defaultValue="123 Artisan St, Craft City" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Connected Wallet</h3>
                  <p className="text-sm text-muted-foreground">0xA2...5eF1</p>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiving-address">
                  EquiProtocol Receiving Address
                </Label>
                <Input
                  id="receiving-address"
                  defaultValue="0xCD265CSa3192cgF482F77C3add57A0c26361E53"
                  readOnly
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-network">Default Network</Label>
                <Select defaultValue="blockdag">
                  <SelectTrigger id="default-network">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blockdag">BlockDAG (Demo)</SelectItem>
                    <SelectItem value="celo">Celo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="auto-convert"
                  className="flex flex-col space-y-1"
                >
                  <span>Auto-convert to Fiat</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically convert USDC to local currency
                  </span>
                </Label>
                <Switch id="auto-convert" />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="invoice-expiry"
                  className="flex flex-col space-y-1"
                >
                  <span>Invoice Expiry</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Set how long invoices remain valid
                  </span>
                </Label>
                <Select defaultValue="24h">
                  <SelectTrigger id="invoice-expiry" className="w-[120px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="48h">48 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="payment-notifications">
                  Payment Notifications
                </Label>
                <Switch id="payment-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="invoice-notifications">Invoice Reminders</Label>
                <Switch id="invoice-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing-notifications">
                  Marketing Updates
                </Label>
                <Switch id="marketing-notifications" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-4">
                  <div className="border rounded-md p-2 cursor-pointer bg-white">
                    <div className="h-20 bg-gray-100 rounded-md mb-2"></div>
                    <p className="text-center text-sm">Light</p>
                  </div>
                  <div className="border rounded-md p-2 cursor-pointer">
                    <div className="h-20 bg-gray-800 rounded-md mb-2"></div>
                    <p className="text-center text-sm">Dark</p>
                  </div>
                  <div className="border rounded-md p-2 cursor-pointer">
                    <div className="h-20 bg-gradient-to-b from-white to-gray-800 rounded-md mb-2"></div>
                    <p className="text-center text-sm">System</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
