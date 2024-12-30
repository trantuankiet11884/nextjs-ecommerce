import { Metadata } from "next";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { IOrder } from "@/lib/db/models/order.model";
import { formatDateTime, formatId } from "@/lib/utils";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import ProductPrice from "@/components/shared/product/product-price";
const PAGE_TITLE = "Đơn hàng của bạn";

export const metadata: Metadata = {
  title: PAGE_TITLE,
};
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const orders = await getMyOrders({
    page,
  });
  return (
    <div>
      <div className="flex gap-2">
        <Link href="/account">Tài khoản</Link>
        <span>›</span>
        <span>{PAGE_TITLE}</span>
      </div>
      <h1 className="h1-bold pt-4">{PAGE_TITLE}</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Ngày đặt ngày</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thanh toán ngày</TableHead>
              <TableHead>Giao hàng</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="">
                  Bạn không có đơn hàng!
                </TableCell>
              </TableRow>
            )}
            {orders.data.map((order: IOrder) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Link href={`/account/orders/${order._id}`}>
                    {formatId(order._id)}
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell>
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "No"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "No"}
                </TableCell>
                <TableCell>
                  <Link href={`/account/orders/${order._id}`}>
                    <span className="px-2">Chi tiết</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          <Pagination page={page} totalPages={orders?.totalPages!} />
        )}
      </div>
      <BrowsingHistoryList className="mt-16" />
    </div>
  );
}
