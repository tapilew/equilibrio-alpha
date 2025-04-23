"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface ProductCardProps {
  name: string
  price: number
  imageUrl: string
  onClick?: () => void
}

export function ProductCard({
  name,
  price,
  imageUrl = "/placeholder.svg?height=200&width=200",
  onClick,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
      <AspectRatio ratio={1 / 1}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = "/placeholder.svg?height=200&width=200"
          }}
        />
      </AspectRatio>
      <CardContent className="p-3">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-muted-foreground">{price} USDC</p>
      </CardContent>
    </Card>
  )
}
