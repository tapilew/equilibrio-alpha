"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";

// Reliable image placeholders
const PLACEHOLDER_IMAGES = {
  "1": "https://placehold.co/400x400/e5e7eb/a1a1aa?text=Basket",
  "2": "https://placehold.co/400x400/e5e7eb/a1a1aa?text=Vase",
  "3": "https://placehold.co/400x400/e5e7eb/a1a1aa?text=Board",
  "4": "https://placehold.co/400x400/e5e7eb/a1a1aa?text=Pillow",
  "5": "https://placehold.co/400x400/e5e7eb/a1a1aa?text=Spoons",
};

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { adminConnectedAddress } = useWalletConnection();
  const isAdminConnected = !!adminConnectedAddress;

  const products: Product[] = [
    {
      id: "1",
      name: "Woven Basket",
      price: 25,
      stock: 10,
      category: "Home Decor",
      imageUrl: PLACEHOLDER_IMAGES["1"],
    },
    {
      id: "2",
      name: "Ceramic Vase",
      price: 32,
      stock: 5,
      category: "Home Decor",
      imageUrl: PLACEHOLDER_IMAGES["2"],
    },
    {
      id: "3",
      name: "Cutting Board",
      price: 18,
      stock: 8,
      category: "Kitchen",
      imageUrl: PLACEHOLDER_IMAGES["3"],
    },
    {
      id: "4",
      name: "Blue Pillow",
      price: 22,
      stock: 15,
      category: "Home Decor",
      imageUrl: PLACEHOLDER_IMAGES["4"],
    },
    {
      id: "5",
      name: "Wooden Spoon Set",
      price: 12,
      stock: 20,
      category: "Kitchen",
      imageUrl: PLACEHOLDER_IMAGES["5"],
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-4">
          <Button disabled={!isAdminConnected}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price (USDC)</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!isAdminConnected}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      disabled={!isAdminConnected}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
