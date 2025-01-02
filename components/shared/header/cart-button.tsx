"use client";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import useIsMounted from "@/hooks/use-is-mounted";
import { cn } from "@/lib/utils";
import useCartStore from "@/hooks/use-cart-store";
import { Badge } from "@/components/ui/badge";
export default function CartButton() {
  const isMounted = useIsMounted();
  const {
    cart: { items },
  } = useCartStore();

  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0);

  return (
    <Link prefetch={true} href="/cart" className="px-1 header-button">
      <div className="flex items-end text-xs relative">
        <ShoppingCartIcon className="h-8 w-8" />
        {isMounted && (
          <Badge
            variant="destructive"
            className={cn(
              `w-6 h-6 px-1 rounded-full text-base flex items-center justify-center font-bold absolute right-[-10px] top-[-10px] z-10`,
              cartItemsCount >= 10 && "text-sm px-0 p-[1px]"
            )}
          >
            {cartItemsCount}
          </Badge>
        )}
      </div>
    </Link>
  );
}
