import { Metadata } from "next";
import ProductList from "./product-list";
export const metadata: Metadata = {
  title: "Quản lý sản phẩm",
};
export default async function AdminProduct() {
  return <ProductList />;
}
