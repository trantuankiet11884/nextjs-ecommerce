"use client";
import ProductPrice from "@/components/shared/product/product-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { calculatePastDate, formatDateTime, formatNumber } from "@/lib/utils";
import { IOrderList } from "@/types";
import {
  BadgeDollarSign,
  Barcode,
  CreditCard,
  EyeIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "./date-range-picker";
import SalesAreaChart from "./sales-area-chart";
import SalesCategoryPieChart from "./sales-category-pie-chart";
import TableChart from "./table-chart";
export default function OverviewReport() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: calculatePastDate(30),
    to: new Date(),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<{ [key: string]: any }>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (date) {
      startTransition(async () => {
        setData(await getOrderSummary(date));
      });
    }
  }, [date]);

  if (!data || isPending)
    return (
      <div className="space-y-4">
        <div>
          <h1 className="h1-bold">Tổng quan</h1>
        </div>
        {/* First Row */}
        <div className="flex gap-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </div>
        {/* Second Row */}
        <div>
          <Skeleton className="h-[30rem] w-full" />
        </div>
        {/* Third Row */}
        <div className="flex gap-4">
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className="h-60 w-full" />
          ))}
        </div>
        {/* Fourth Row */}
        <div className="flex gap-4">
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className="h-60 w-full" />
          ))}
        </div>
      </div>
    );
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="h1-bold">Tổng quan</h1>
        <CalendarDateRangePicker defaultDate={date} setDate={setDate} />
      </div>
      <div className="space-y-4">
        <div className="grid gap-4  grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              <BadgeDollarSign />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                <ProductPrice price={data.totalSales} plain />
              </div>
              <div>
                <Link className="text-xs" href="/admin/orders">
                  Xem chi tiết
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng sản phẩm bán được
              </CardTitle>
              <CreditCard />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {formatNumber(data.ordersCount)}
              </div>
              <div>
                <Link className="text-xs" href="/admin/orders">
                  Xem đơn hàng
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
              <Users />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{data.usersCount}</div>
              <div>
                <Link className="text-xs" href="/admin/users">
                  Xem chi tiết
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
              <Barcode />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{data.productsCount}</div>
              <div>
                <Link className="text-xs" href="/admin/products">
                  Xem chi tiết
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesAreaChart data={data.salesChartData} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Thu nhập của bạn</CardTitle>
              <CardDescription>Ước tính · 6 tháng qua</CardDescription>
            </CardHeader>
            <CardContent>
              <TableChart data={data.monthlySales} labelType="month" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
              <CardDescription>
                {formatDateTime(date!.from!).dateOnly} đến{" "}
                {formatDateTime(date!.to!).dateOnly}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableChart data={data.topSalesProducts} labelType="product" />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Loại sản phẩm bán chạy nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesCategoryPieChart data={data.topSalesCategories} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mua bởi</TableHead>
                    <TableHead>Ngày mua hàng</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.latestOrders.map((order: IOrderList) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        {order.user ? order.user.name : "Deleted User"}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(order.createdAt).dateOnly}
                      </TableCell>
                      <TableCell>
                        <ProductPrice price={order.totalPrice} plain />đ
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/orders/${order._id}`}>
                          <span className="px-2 flex items-center justify-center">
                            <EyeIcon />
                          </span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
