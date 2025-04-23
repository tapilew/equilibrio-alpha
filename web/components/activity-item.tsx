import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, FileText, ExternalLink } from "lucide-react"

interface ActivityItemProps {
  type: "pos" | "invoice"
  amount: number
  source: string
  timestamp: string
  status: "confirmed" | "pending" | "failed"
  network: string
  explorerUrl?: string
}

export function ActivityItem({
  type = "pos",
  amount = 12.5,
  source = "POS Sale",
  timestamp = "Today, 14:53",
  status = "confirmed",
  network = "BlockDAG",
  explorerUrl,
}: ActivityItemProps) {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
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
                <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                  <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
