/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCartStore from "@/hooks/use-cart-store";
import { useToast } from "@/hooks/use-toast";
import { OrderItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function AddToCart({
  item,
  minimal = false,
}: {
  item: OrderItem;
  minimal?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const number = Number(value);

    setQuantity(!isNaN(number) && number > 0 ? number : 1);
  };

  return minimal ? (
    <Button
      className="rounded-full w-auto"
      onClick={() => {
        try {
          addItem(item, 1);
          toast({
            description: "Added to Cart",
            action: (
              <Button
                onClick={() => {
                  router.push("/cart");
                }}
              >
                Giỏ hàng
              </Button>
            ),
          });
        } catch (error: any) {
          alert(error);
          toast({
            variant: "destructive",
            description: error.message,
          });
        }
      }}
    >
      Thêm vào giỏ hàng
    </Button>
  ) : (
    <div className="w-full space-y-2">
      <Input
        value={quantity}
        onChange={handleQuantityChange}
        type="number"
        min={1}
      />
      <Button
        className="rounded-full w-full"
        type="button"
        onClick={async () => {
          try {
            const itemId = await addItem(item, quantity);
            router.push(`/cart/${itemId}`);
          } catch (error: any) {
            alert(error);
            toast({
              variant: "destructive",
              description: error,
            });
          }
        }}
      >
        Thêm vào giỏ hàng
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          try {
            addItem(item, quantity);
            router.push(`/checkout`);
          } catch (error: any) {
            toast({
              variant: "destructive",
              description: error.message,
            });
          }
        }}
        className="w-full rounded-full "
      >
        Mua ngay
      </Button>
    </div>
  );
}
