import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { formatDateTime, formatId } from "@/lib/utils";
import { IOrderList } from "@/types";
import ProductPrice from "@/components/shared/product/product-price";
import { EyeIcon } from "lucide-react";
export const metadata: Metadata = {
  title: "Admin Orders",
};
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const searchParams = await props.searchParams;
  const { page = "1" } = searchParams;
  const session = await auth();
  if (session?.user.role !== "Admin")
    throw new Error("Admin permission required");
  const orders = await getAllOrders({
    page: Number(page),
  });
  return (
    <div className="space-y-2">
      <h1 className="h1-bold">Đơn hàng</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Ngày tạo đơn</TableHead>
              <TableHead>Đặt hàng bởi</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thanh toán ngày</TableHead>
              <TableHead>Giao ngày</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order: IOrderList) => (
              <TableRow key={order._id}>
                <TableCell>{formatId(order._id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell>{order.user ? order.user.name : "-"}</TableCell>
                <TableCell>
                  {" "}
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "Không"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "Không"}
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/orders/${order._id}`}>
                      <EyeIcon />
                    </Link>
                  </Button>
                  <DeleteDialog id={order._id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages!} />
        )}
      </div>
    </div>
  );
}
