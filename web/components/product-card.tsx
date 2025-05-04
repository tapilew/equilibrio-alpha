"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Wallet } from "lucide-react";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";

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
  const [isActive, setIsActive] = useState(false);
  const { customerConnectedAddress } = useWalletConnection();
  const isCustomerConnected = !!customerConnectedAddress;

  return (
    <Card
      className="overflow-hidden touch-manipulation"
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <AspectRatio ratio={1}>
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full bg-gray-100"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/400x400/e5e7eb/a1a1aa?text=${encodeURIComponent(name)}`;
              }}
            />
          </AspectRatio>
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
              isActive ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
            }`}
          >
            {isCustomerConnected ? (
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full w-12 h-12 shadow-lg transform transition-transform active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
            ) : (
              <div className="text-center text-white p-4">
                <Wallet className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Connect wallet to add</p>
              </div>
            )}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{price} USDC</p>
        </div>
      </CardContent>
    </Card>
  );
}
