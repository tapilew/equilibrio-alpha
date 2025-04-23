import { PosLayout } from "@/components/pos/pos-layout"
import { PaymentRequestDisplay } from "@/components/payment-request-display"
import { PaymentConfirmation } from "@/components/payment-confirmation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentPage() {
  return (
    <PosLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Order Total: 79 USDC</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="qr">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="link">Payment Link</TabsTrigger>
              </TabsList>
              <TabsContent value="qr" className="pt-4">
                <PaymentRequestDisplay
                  amount={79}
                  receivingAddress="0xCD265CSa3192cgF482F77C3add57A0c26361E53"
                  network="BlockDAG (Demo)"
                />
              </TabsContent>
              <TabsContent value="link" className="pt-4">
                <div className="text-center space-y-4">
                  <p>Share this payment link with your customer:</p>
                  <div className="bg-gray-100 p-3 rounded-md text-sm overflow-hidden overflow-ellipsis">
                    https://equiprotocol.io/pay/POS-12345
                  </div>
                  <Button className="w-full">Copy Payment Link</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* This would normally be shown conditionally when payment is received */}
        <PaymentConfirmation amount={79} timestamp="14:53 UTC" network="BlockDAG" onNewSale={() => {}} />

        <div className="mt-4 flex justify-between">
          <Button variant="outline">Cancel Payment</Button>
          <Button>Complete Sale</Button>
        </div>
      </div>
    </PosLayout>
  )
}
