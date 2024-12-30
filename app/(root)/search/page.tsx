import CollapsibleOnMobile from "@/components/shared/collapsible-on-mobile";
import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/product/product-card";
import ProductSortSelector from "@/components/shared/product/product-sort-selector";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllProducts,
  getAllTags,
} from "@/lib/actions/products.actions";
import { IProduct } from "@/lib/db/models/product.model";
import { getFilterUrl, toSlug } from "@/lib/utils";
import Link from "next/link";
const sortOrders = [
  { value: "price-low-to-high", name: "Giá từ thấp đến cao" },
  { value: "price-high-to-low", name: "Giá từ cao đến thấp" },
  { value: "newest-arrivals", name: "Sản phẩm mới nhất" },
  { value: "avg-customer-review", name: "Trung bình đánh giá của khách hàng" },
  { value: "best-selling", name: "Sản phẩm bán chạy nhất" },
];

const prices = [
  {
    name: "1 đến 20,000 đ",
    value: "1-20",
  },
  {
    name: "21,000 đến 50,000 đ",
    value: "21-50",
  },
  {
    name: "51,000 đến 1,000,000 đ",
    value: "51-1000",
  },
];
export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    tag: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const {
    q = "all",
    category = "all",
    tag = "all",
    price = "all",
    rating = "all",
  } = searchParams;
  if (
    (q !== "all" && q !== "") ||
    category !== "all" ||
    tag !== "all" ||
    rating !== "all" ||
    price !== "all"
  ) {
    return {
      title: `Search ${q !== "all" ? q : ""}
          ${category !== "all" ? ` : Category ${category}` : ""}
          ${tag !== "all" ? ` : Tag ${tag}` : ""}
          ${price !== "all" ? ` : Price ${price}` : ""}
          ${rating !== "all" ? ` : Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Tìm kiếm sản phẩn",
    };
  }
}
export default async function SearchPage(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    tag: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const {
    q = "all",
    category = "all",
    tag = "all",
    price = "all",
    rating = "all",
    sort = "best-selling",
    page = "1",
  } = searchParams;
  const params = { q, category, tag, price, rating, sort, page };
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const data = await getAllProducts({
    category,
    tag,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  });
  return (
    <div>
      <div className="mb-2 py-2 md:border-b flex-between flex-col md:flex-row ">
        <div className="flex items-center">
          {data.totalProducts === 0
            ? "0"
            : `${data.from}-${data.to} / ${data.totalProducts}`}{" "}
          kết quả được tìm thấy
          {(q !== "all" && q !== "") ||
          (category !== "all" && category !== "") ||
          (tag !== "all" && tag !== "") ||
          rating !== "all" ||
          price !== "all"
            ? ``
            : null}
          {q !== "all" && q !== "" && '"' + q + '"'}
          &nbsp;
          {(q !== "all" && q !== "") ||
          (category !== "all" && category !== "") ||
          (tag !== "all" && tag !== "") ||
          rating !== "all" ||
          price !== "all" ? (
            <Button variant={"link"} asChild>
              <Link href="/search">Bỏ chọn</Link>
            </Button>
          ) : null}
        </div>
        <div>
          <ProductSortSelector
            sortOrders={sortOrders}
            sort={sort}
            params={params}
          />
        </div>
      </div>
      <div className="bg-card grid md:grid-cols-5 md:gap-4">
        <CollapsibleOnMobile title="Filters">
          <div className="space-y-4">
            <div>
              <div className="font-bold">Loại sản phẩm</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ("all" === category || "" === category) && "text-primary"
                    }`}
                    href={getFilterUrl({ category: "all", params })}
                  >
                    Tất cả
                  </Link>
                </li>
                {categories.map((c: string) => (
                  <li key={c}>
                    <Link
                      className={`${c === category && "text-primary"}`}
                      href={getFilterUrl({ category: c, params })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold">Giá</div>
              <ul>
                <li>
                  <Link
                    className={`${"all" === price && "text-primary"}`}
                    href={getFilterUrl({ price: "all", params })}
                  >
                    Tất cả
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      href={getFilterUrl({ price: p.value, params })}
                      className={`${p.value === price && "text-primary"}`}
                    >
                      {/* {formatCurrency(p.name)} */}
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold">Tùy chọn</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ("all" === tag || "" === tag) && "text-primary"
                    }`}
                    href={getFilterUrl({ tag: "all", params })}
                  >
                    Tất cả
                  </Link>
                </li>
                {tags.map((t: string) => {
                  const displayText =
                    t === "Best Seller"
                      ? "Sản phẩm bán chạy nhất"
                      : t === "Featured"
                        ? "Phổ biến nhất"
                        : t === "New Arrival"
                          ? "Sản phẩm mới nhất"
                          : t === "Todays Deal"
                            ? "Khuyến mãi hôm nay"
                            : t;

                  return (
                    <li key={t}>
                      <Link
                        className={`${toSlug(t) === tag && "text-primary"}`}
                        href={getFilterUrl({ tag: t, params })}
                      >
                        {displayText}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </CollapsibleOnMobile>
        <div className="md:col-span-4 space-y-4">
          <div>
            <div className="font-bold text-xl">
              {data.totalProducts} Kết quả
            </div>
            <div>
              Kiểm tra từng trang sản phẩm để biết các lựa chọn mua hàng khác
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3  ">
            {data.products.length === 0 && <div>Không tìm thấy sản phẩm</div>}
            {data.products.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {data!.totalPages! > 1 && (
            <Pagination page={page} totalPages={data!.totalPages} />
          )}
        </div>
      </div>
    </div>
  );
}
