"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, FileText, ExternalLink, ChevronDown, ChevronUp, Tag, Copy, CheckCircle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ActivityItemProps {
  id: string
  type: "pos" | "invoice"
  amount: number
  source: string
  timestamp: string
  status: "confirmed" | "pending" | "failed"
  network: string
  explorerUrl?: string
  transactionHash?: string
  metadata?: {
    customerInfo?: string
    invoiceId?: string
    productIds?: string[]
    products?: Array<{
      name: string
      quantity: number
      price: number
    }>
    paymentMethod?: string
    notes?: string
    tags?: string[]
  }
  onTagAdd?: (id: string, tag: string) => void
}

export function ActivityItem({
  id,
  type = "pos",
  amount = 12.5,
  source = "POS Sale",
  timestamp = "Today, 14:53",
  status = "confirmed",
  network = "BlockDAG",
  explorerUrl,
  transactionHash = "0x8f6e5d4c3b2a1908f7e6d5c4b3a2190",
  metadata,
  onTagAdd,
}: ActivityItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [newTag, setNewTag] = useState("")

  const handleCopyHash = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleAddTag = () => {
    if (newTag && onTagAdd) {
      onTagAdd(id, newTag)
      setNewTag("")
    }
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="mb-3">
      <Card className={isExpanded ? "border-blue-200" : ""}>
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-3">
            {/* Icon */}
            <div className={`rounded-full p-2 ${type === "pos" ? "bg-green-100" : "bg-blue-100"}`}>
              {type === "pos" ? (
                <DollarSign className={`h-5 w-5 ${type === "pos" ? "text-green-600" : "text-blue-600"}`} />
              ) : (
                <FileText className={`h-5 w-5 ${type === "pos" ? "text-green-600" : "text-blue-600"}`} />
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1">
              <div className="font-medium">+{amount} USDC</div>
              <div className="text-sm text-muted-foreground">{source}</div>
            </div>

            {/* Details */}
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{timestamp}</div>
              <div className="flex items-center gap-1 mt-1 justify-end">
                <Badge
                  variant={status === "confirmed" ? "default" : "outline"}
                  className={status === "confirmed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                  {status === "confirmed" ? "Confirmed" : status === "pending" ? "Pending" : "Failed"}
                </Badge>

                <Badge variant="outline" className="text-xs">
                  {network}
                </Badge>

                {explorerUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View on Explorer</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>

          <CollapsibleContent>
            <Separator />
            <div className="p-4 bg-gray-50 text-sm space-y-4">
              {/* Transaction Details */}
              <div>
                <h4 className="font-medium mb-2">Transaction Details</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="text-muted-foreground">Transaction Hash:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <code className="text-xs bg-gray-100 p-1 rounded overflow-hidden overflow-ellipsis max-w-[120px]">
                      {transactionHash}
                    </code>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCopyHash}>
                      {isCopied ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Payment Method:</span>
                  </div>
                  <div>{metadata?.paymentMethod || "USDC Direct"}</div>

                  <div>
                    <span className="text-muted-foreground">Customer:</span>
                  </div>
                  <div>{metadata?.customerInfo || "Anonymous"}</div>
                </div>
              </div>

              {/* Product Details (if available) */}
              {metadata?.products && metadata.products.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {metadata.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          {product.quantity}x {product.name}
                        </div>
                        <div>{product.price * product.quantity} USDC</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {metadata?.tags && metadata.tags.length > 0 ? (
                    metadata.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="px-2 py-1">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">No tags yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Add tag..."
                      className="w-full pl-8 h-8 text-xs rounded-md border border-input bg-background px-3 py-1"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    />
                  </div>
                  <Button size="sm" variant="outline" className="h-8" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                <textarea
                  className="w-full h-16 text-xs rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Add notes about this transaction..."
                  defaultValue={metadata?.notes || ""}
                ></textarea>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  )
}
