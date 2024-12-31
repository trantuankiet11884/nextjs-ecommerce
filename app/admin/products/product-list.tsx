/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IProduct } from "@/lib/db/models/product.model";
import React, { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Edit2Icon, EyeIcon } from "lucide-react";
import {
  deleteProduct,
  getAllProductsForAdmin,
} from "@/lib/actions/products.actions";
type ProductListDataProps = {
  products: IProduct[];
  totalPages: number;
  totalProducts: number;
  to: number;
  from: number;
};
const ProductList = () => {
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [data, setData] = useState<ProductListDataProps>();
  const [isPending, startTransition] = useTransition();
  const handlePageChange = (changeType: "next" | "prev") => {
    const newPage = changeType === "next" ? page + 1 : page - 1;
    if (changeType === "next") {
      setPage(newPage);
    } else {
      setPage(newPage);
    }
    startTransition(async () => {
      const data = await getAllProductsForAdmin({
        query: inputValue,
        page: newPage,
      });
      setData(data);
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      clearTimeout((window as any).debounce);
      (window as any).debounce = setTimeout(() => {
        startTransition(async () => {
          const data = await getAllProductsForAdmin({ query: value, page: 1 });
          setData(data);
        });
      }, 500);
    } else {
      startTransition(async () => {
        const data = await getAllProductsForAdmin({ query: "", page });
        setData(data);
      });
    }
  };
  useEffect(() => {
    startTransition(async () => {
      const data = await getAllProductsForAdmin({ query: "" });
      setData(data);
    });
  }, []);
  return (
    <div>
      <div className="space-y-2">
        <div className="flex-between flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-2 ">
            <h1 className="font-bold text-lg">Sản phẩm</h1>
            <div className="flex flex-wrap items-center  gap-2 ">
              <Input
                className="w-auto"
                type="text "
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Tìm theo tên sản phẩm"
              />
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
              ) : (
                <p>
                  {data?.totalProducts === 0
                    ? "0"
                    : `${data?.from}-${data?.to} of ${data?.totalProducts}`}
                  {" kết quả"}
                </p>
              )}
            </div>
          </div>
          <Button asChild variant="default">
            <Link href="/admin/products/create">Tạo mới</Link>
          </Button>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead className="text-right">Giá</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Đã xuất</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead className="w-[100px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products.map((product: IProduct) => (
                <TableRow key={product._id}>
                  <TableCell>{formatId(product._id)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/products/${product._id}`}>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(product.price)}VNĐ
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>{product.avgRating}</TableCell>
                  <TableCell>
                    {product.isPublished ? "Đã xuất bản" : "Chưa xuất bản"}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(product.updatedAt).dateTime}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant="warning" size="sm">
                      <Link href={`/admin/products/${product._id}`}>
                        <Edit2Icon />
                      </Link>
                    </Button>
                    <Button asChild variant="info" size="sm">
                      <Link target="_blank" href={`/product/${product.slug}`}>
                        <EyeIcon />
                      </Link>
                    </Button>
                    <DeleteDialog
                      id={product._id}
                      action={deleteProduct}
                      callbackAction={() => {
                        startTransition(async () => {
                          const data = await getAllProductsForAdmin({
                            query: inputValue,
                          });
                          setData(data);
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(data?.totalPages ?? 0) > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange("prev")}
                disabled={Number(page) <= 1}
                className="w-24"
              >
                <ChevronLeft />
              </Button>
              Trang {page} / {data?.totalPages}
              <Button
                variant="outline"
                onClick={() => handlePageChange("next")}
                disabled={Number(page) >= (data?.totalPages ?? 0)}
                className="w-24"
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductList;
