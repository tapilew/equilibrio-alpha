"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

interface HomeStatusProps {
  isWalletConnected?: boolean
  walletAddress?: string
  receivingAddress?: string
  network?: string
}

export function HomeStatus({
  isWalletConnected = false,
  walletAddress = "0xA2...5eF1",
  receivingAddress = "0xCD265CSa3192cgF482F77C3add57A0c26361E53",
  network = "BlockDAG (Demo)",
}: HomeStatusProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-white text-2xl">🏇</span>
        </div>
        <h1 className="text-3xl font-bold">EquiProtocol</h1>
      </div>

      {!isWalletConnected ? (
        <Button
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            /* Connect Wallet Logic */
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        <Card className="border rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 p-4 border-b">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="font-medium">{walletAddress}</span>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-medium">Your EquiProtocolMVP Receiving Address on {network}</h3>

              <div className="mt-3 flex items-center gap-2">
                <code className="flex-1 p-3 bg-gray-100 rounded-md text-sm overflow-hidden overflow-ellipsis">
                  {receivingAddress}
                </code>
                <Button variant="ghost" size="icon" onClick={handleCopyAddress} className="flex-shrink-0">
                  {isCopied ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>

              <AlertDescription className="mt-3 text-sm text-muted-foreground">
                This address is your programmable payment gateway for receiving USDC payments through EquiProtocol.
              </AlertDescription>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
