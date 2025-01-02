"use client";
import useBrowsingHistory from "@/hooks/use-browsing-history";
import React, { useEffect } from "react";
import ProductSlider from "./product/product-slider";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
export default function BrowsingHistoryList({
  className,
}: {
  className?: string;
}) {
  const { products } = useBrowsingHistory();

  return (
    <>
      {products.length !== 0 && (
        <div className="flex flex-col gap-4">
          <div className="bg-background rounded-md p-4">
            <Separator className={cn("", className)} />
            <ProductList
              title={"Liên quan đến các sản phẩm bạn đã xem"}
              type="related"
            />
          </div>
          <div className="bg-background rounded-md p-4">
            <Separator className="" />
            <ProductList
              title={"Lịch sử duyệt web của bạn"}
              hideDetails
              type="history"
            />
          </div>
        </div>
      )}
    </>
  );
}
function ProductList({
  title,
  type = "history",
  hideDetails = false,
}: {
  title: string;
  type: "history" | "related";
  hideDetails?: boolean;
}) {
  const { products } = useBrowsingHistory();
  const [data, setData] = React.useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `/api/products/browsing-history?type=${type}&categories=${products
          .map((product) => product.category)
          .join(",")}&ids=${products.map((product) => product.id).join(",")}`
      );
      const data = await res.json();
      setData(data);
    };
    fetchProducts();
  }, [products, type]);

  return (
    <div className="mt-8">
      {data.length > 0 && (
        <ProductSlider
          title={title}
          products={data}
          hideDetails={hideDetails}
        />
      )}
    </div>
  );
}
