"use client";

import { useRouter } from "next/navigation";
import { PosLayout } from "@/components/pos/pos-layout";
import { ProductGrid } from "@/components/product-grid";
import { CartSummary } from "@/components/cart-summary";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { customerConnectedAddress } = useWalletConnection();
  const isCustomerConnected = !!customerConnectedAddress;

  const userId = "demo-user"; // TODO: Replace with actual user ID from auth

  const products = useQuery(api.myFunctions.listProducts) ?? [];
  // Always call the hook, but skip the query if wallet is not connected
  const cartItems =
    useQuery(
      api.myFunctions.getCartItems,
      isCustomerConnected ? { userId } : "skip",
    ) ?? [];
  const addToCart = useMutation(api.myFunctions.addToCart);

  const handleAddToCart = async (product: {
    _id: Id<"products">;
    name: string;
    price: number;
    imageUrl: string;
  }) => {
    if (!isCustomerConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart({
        userId,
        productId: product._id,
        quantity: 1,
      });
      toast({
        title: "Success",
        description: "Added to cart",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePayment = () => {
    if (!isCustomerConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to proceed with checkout",
        variant: "destructive",
      });
      return;
    }
    router.push("/pos/checkout");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const calculateItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <PosLayout>
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
      </div>

      {!isCustomerConnected && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Connect your wallet to add items to cart and make purchases.
          </AlertDescription>
        </Alert>
      )}

      <ProductGrid products={products} onProductSelect={handleAddToCart} />
      {isCustomerConnected && (
        <CartSummary
          itemCount={calculateItemCount()}
          totalAmount={calculateTotal()}
          onGeneratePayment={handleGeneratePayment}
          isPaymentDisabled={!isCustomerConnected}
        />
      )}
    </PosLayout>
  );
}
