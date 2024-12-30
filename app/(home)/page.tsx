import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import { HomeCard } from "@/components/shared/home/home-card";
import { HomeCarousel } from "@/components/shared/home/home-carousel";
import ProductSlider from "@/components/shared/product/product-slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllCategories,
  getProductsByTag,
  getProductsForCard,
} from "@/lib/actions/products.actions";
import data from "@/lib/data";
import { toSlug } from "@/lib/utils";

export default async function Page() {
  const categories = (await getAllCategories()).slice(0, 4);
  const newArrivals = await getProductsForCard({
    tag: "new-arrival",
    limit: 4,
  });
  const featureds = await getProductsForCard({
    tag: "featured",
    limit: 4,
  });
  const bestSellers = await getProductsForCard({
    tag: "best-seller",
    limit: 4,
  });

  const cards = [
    {
      title: "Danh mục để khám phá",
      link: {
        text: "Xem thêm",
        href: "/search",
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: "Khám phá sản phẩm mới",
      items: newArrivals,
      link: {
        text: "Xem tất cả",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "Khám phá sản phẩm bán chạy nhất",
      items: bestSellers,
      link: {
        text: "Xem tất cả",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "Sản phẩm nổi bật",
      items: featureds,
      link: {
        text: "Mua ngay",
        href: "/search?tag=new-arrival",
      },
    },
  ];

  const todaysDeals = await getProductsByTag({ tag: "todays-deal" });

  const bestSellingProducts = await getProductsByTag({ tag: "best-seller" });

  return (
    <>
      <HomeCarousel items={data.carousels} />
      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCard cards={cards} />

        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider
              title={"Khuyến mãi hôm nay"}
              products={todaysDeals}
            />
          </CardContent>
        </Card>
        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider
              title="Sản phẩm bán chạy"
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>
      <div className="p-4 bg-background">
        <BrowsingHistoryList />
      </div>
    </>
  );
}
