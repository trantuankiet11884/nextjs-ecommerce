"use client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IOrder } from "@/lib/db/models/order.model";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ProductPrice from "../product/product-price";
import { deliverOrder, updateOrderToPaid } from "@/lib/actions/order.actions";
import ActionButton from "../action-button";
export default function OrderDetailsForm({
  order,
  isAdmin,
}: {
  order: IOrder;
  isAdmin: boolean;
}) {
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    expectedDeliveryDate,
  } = order;
  return (
    <div className="grid md:grid-cols-3 md:gap-5">
      <div className="overflow-x-auto md:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Địa chỉ giao hàng</h2>
            <p>
              {shippingAddress.fullName} {shippingAddress.phone}
            </p>
            <p>
              {shippingAddress.street}, {shippingAddress.city},{" "}
              {shippingAddress.province}, {shippingAddress.postalCode},{" "}
              {shippingAddress.country}{" "}
            </p>
            {isDelivered ? (
              <Badge>
                ​giao hàng vào lúc {formatDateTime(deliveredAt!).dateTime}
              </Badge>
            ) : (
              <div>
                <Badge variant="destructive">Chưa giao hàng</Badge>
                <div>
                  Dự kiến ​​giao hàng vào lúc{" "}
                  {formatDateTime(expectedDeliveryDate!).dateTime}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Phương thức thanh toán</h2>
            <p>{paymentMethod}</p>
            {isPaid ? (
              <Badge>
                Thanh toán vào lúc {formatDateTime(paidAt!).dateTime}
              </Badge>
            ) : (
              <Badge variant="destructive">Chưa thanh toán</Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4   gap-4">
            <h2 className="text-xl pb-4">Sản phẩm</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        prefetch={true}
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          loading="lazy"
                        ></Image>
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="px-2">{item.quantity}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent className="p-4  space-y-4 gap-4">
            <h2 className="text-xl pb-4">Đơn hàng</h2>
            <div className="flex justify-between">
              <div>Sản phẩm</div>
              <div>
                {" "}
                <ProductPrice price={itemsPrice} plain />
              </div>
            </div>
            <div className="flex justify-between">
              <div>VAT</div>
              <div>
                {" "}
                <ProductPrice price={taxPrice} plain />
              </div>
            </div>
            <div className="flex justify-between">
              <div>Phí vận chuyển</div>
              <div>
                {" "}
                <ProductPrice price={shippingPrice} plain />
              </div>
            </div>
            <div className="flex justify-between">
              <div>Tổng</div>
              <div>
                {" "}
                <ProductPrice price={totalPrice} plain />
              </div>
            </div>
            {!isPaid && ["Stripe", "PayPal"].includes(paymentMethod) && (
              <Link
                prefetch={true}
                className={cn(buttonVariants(), "w-full")}
                href={`/checkout/${order._id}`}
              >
                Thanh toán đơn hàng
              </Link>
            )}

            {isAdmin && !isPaid && paymentMethod === "Cash On Delivery" && (
              <ActionButton
                caption="Đánh dấu là đã thanh toán"
                action={() => updateOrderToPaid(order._id)}
              />
            )}
            {isAdmin && isPaid && !isDelivered && (
              <ActionButton
                caption="Đánh dấu là đã giao hàng"
                action={() => deliverOrder(order._id)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
