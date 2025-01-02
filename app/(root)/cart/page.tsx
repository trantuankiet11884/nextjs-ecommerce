"use client";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import ProductPrice from "@/components/shared/product/product-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useCartStore from "@/hooks/use-cart-store";
import {
  APP_NAME,
  colorTranslations,
  FREE_SHIPPING_MIN_PRICE,
} from "@/lib/constants";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function CartPage() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleQuantityChange = (item: any, quantity: number) => {
    if (quantity >= 1 && quantity <= item.countInStock) {
      updateItem(item, quantity);
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-4  md:gap-4">
        {items.length === 0 ? (
          <Card className="col-span-4 rounded-none">
            <CardHeader className="text-3xl  ">
              Giỏ hàng của bạn đang trống
            </CardHeader>
            <CardContent>
              Tiếp tục mua hàng tại{" "}
              <Link prefetch={true} href="/" className="font-bold">
                {APP_NAME}
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="col-span-3">
              <Card className="rounded-none">
                <CardHeader className="text-3xl pb-0">Giỏ hàng</CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-end border-b mb-4">Giá</div>
                  {items.map((item) => (
                    <div
                      key={item.clientId}
                      className="flex flex-col md:flex-row justify-between py-4 border-b gap-4"
                    >
                      <Link prefetch={true} href={`/product/${item.slug}`}>
                        <div className="relative w-40 h-40">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="20vw"
                            style={{
                              objectFit: "contain",
                            }}
                            loading="lazy"
                          />
                        </div>
                      </Link>
                      <div className="flex-1 space-y-4">
                        <Link
                          prefetch={true}
                          href={`/product/${item.slug}`}
                          className="text-lg hover:no-underline  "
                        >
                          {item.name}
                        </Link>
                        <div>
                          <p className="text-sm">
                            <span className="font-bold">Màu: </span>{" "}
                            {item?.color
                              ? colorTranslations[item?.color]
                              : (item?.color ?? "-")}
                          </p>
                          <p className="text-sm">
                            <span className="font-bold">Kích thước: </span>{" "}
                            {item.size}
                          </p>
                        </div>
                        <p>Số lượng</p>
                        <div className="flex gap-2 items-center">
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item, Number(e.target.value))
                            }
                            className="w-14 text-center border rounded"
                            min="1"
                            max={item.countInStock}
                            readOnly
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.countInStock}
                          >
                            <PlusIcon />
                          </Button>
                          <Button
                            variant={"outline"}
                            onClick={() => removeItem(item)}
                          >
                            <TrashIcon color="red" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-right">
                          {item.quantity > 1 && (
                            <>
                              {item.quantity} x
                              <ProductPrice price={item.price} plain />
                              <br />
                            </>
                          )}
                          <span className="font-bold text-lg">
                            <ProductPrice
                              price={item.price * item.quantity}
                              plain
                            />
                            VNĐ
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end text-lg my-2">
                    Tổng ({items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    sản phẩm):{" "}
                    <span className="font-bold ml-1">
                      <ProductPrice price={itemsPrice} plain />
                      VNĐ
                    </span>{" "}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="rounded-none">
                <CardContent className="py-4 space-y-4">
                  {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                    <div className="flex-1">
                      Thêm{" "}
                      <span className="text-green-700">
                        <ProductPrice
                          price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                          plain
                        />
                      </span>{" "}
                      đơn hàng của bạn đủ điều kiện miễn phí vận chuyển
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className="text-green-700">
                        Đơn hàng của bạn đủ điều kiện miễn phí vận chuyển.
                      </span>{" "}
                      Chọn tùy chọn này khi thanh toán.
                    </div>
                  )}
                  <div className="text-lg">
                    Tổng ({items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    sản phẩm):{" "}
                    <span className="font-bold">
                      <ProductPrice price={itemsPrice} plain />
                      VNĐ
                    </span>{" "}
                  </div>
                  <Button
                    onClick={() => router.push("/checkout")}
                    className="rounded-full w-full"
                  >
                    Thanh toán
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      <BrowsingHistoryList className="mt-10" />
    </div>
  );
}
