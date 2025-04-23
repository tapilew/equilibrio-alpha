"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const products: Product[] = [
    {
      id: "1",
      name: "Woven Basket",
      price: 25,
      stock: 10,
      category: "Home Decor",
      imageUrl: "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "2",
      name: "Ceramic Vase",
      price: 32,
      stock: 5,
      category: "Home Decor",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b7e239e5d5e8?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "3",
      name: "Cutting Board",
      price: 18,
      stock: 8,
      category: "Kitchen",
      imageUrl: "https://images.unsplash.com/photo-1592156328697-079f6ba4dbf2?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "4",
      name: "Blue Pillow",
      price: 22,
      stock: 15,
      category: "Home Decor",
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "5",
      name: "Wooden Spoon Set",
      price: 12,
      stock: 20,
      category: "Kitchen",
      imageUrl: "https://images.unsplash.com/photo-1584990347449-a7d69a79cd8d?w=400&h=400&fit=crop&q=80",
    },
  ]

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
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
                    <Avatar className="h-10 w-10 rounded">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.src = "/placeholder.svg?height=40&width=40"
                        }}
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
