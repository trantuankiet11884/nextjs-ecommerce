import Link from "next/link";
import ProductForm from "../product-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Product",
};
const CreateProductPage = () => {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex mb-4">
        <Link prefetch={true} href="/admin/products">
          Sản phẩm
        </Link>
        <span className="mx-1">›</span>
        <Link prefetch={true} href="/admin/products/create">
          Tạo sản phẩm
        </Link>
      </div>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </main>
  );
};
export default CreateProductPage;
