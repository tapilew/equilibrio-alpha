"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  imageUrl: string;
  onClick?: () => void;
}

export function ProductCard({
  name,
  price,
  imageUrl,
  onClick,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <AspectRatio ratio={1}>
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/400x400/e5e7eb/a1a1aa?text=${encodeURIComponent(name)}`;
              }}
            />
          </AspectRatio>
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                onClick={onClick}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium">{name}</h3>
          <p className="text-muted-foreground">{price} USDC</p>
        </div>
      </CardContent>
    </Card>
  );
}
