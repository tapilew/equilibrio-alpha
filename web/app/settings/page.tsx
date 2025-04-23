import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Connected Wallet</h3>
                <p className="text-sm text-muted-foreground">0xA2...5eF1</p>
              </div>
              <Button variant="outline" size="sm">
                Disconnect
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Merchant Name</h3>
                <p className="text-sm text-muted-foreground">Artisan Crafts</p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Default Network</h3>
                <p className="text-sm text-muted-foreground">BlockDAG (Demo)</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-convert" className="flex flex-col space-y-1">
                <span>Auto-convert to Fiat</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Automatically convert USDC to local currency
                </span>
              </Label>
              <Switch id="auto-convert" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="payment-notifications">Payment Notifications</Label>
              <Switch id="payment-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="invoice-notifications">Invoice Reminders</Label>
              <Switch id="invoice-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="marketing-notifications">Marketing Updates</Label>
              <Switch id="marketing-notifications" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
