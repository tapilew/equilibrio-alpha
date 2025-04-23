"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";

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
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const placeholderUrl = `https://placehold.co/400x400/e5e7eb/a1a1aa?text=${encodeURIComponent(name)}`;

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <AspectRatio ratio={1 / 1}>
        <img
          src={imgSrc}
          alt={name}
          className="object-cover w-full h-full"
          onError={() => {
            // Fallback to placeholder if image fails to load
            setImgSrc(placeholderUrl);
          }}
        />
      </AspectRatio>
      <CardContent className="p-3">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-muted-foreground">{price} USDC</p>
      </CardContent>
    </Card>
  );
}
