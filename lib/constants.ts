export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Next.js";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Next.js";
export const APP_SLOGAN = process.env.NEXT_PUBLIC_APP_SLOGAN || "Next.js";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
);

export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © 2025 ${APP_NAME}. All rights reserved.`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const colorTranslations: any = {
  Red: "Đỏ",
  Blue: "Xanh",
  Green: "Xanh lá",
  Yellow: "Vàng",
  Black: "Đen",
  White: "Trắng",
  Grey: "Xám",
  Brown: "Nâu",
  Silver: "Bạc",
  Orange: "Cam",
  Pink: "Hồng",
  Purple: "Tím",
  Cyan: "Xanh lam nhạt",
  Magenta: "Hồng fuchsia",
  Lime: "Chanh",
  Indigo: "Chàm",
  Violet: "Tím nhạt",
  Teal: "Xanh ngọc",
  Aqua: "Nước biển",
  Coral: "San hô",
  Navy: "Xanh hải quân",
  Beige: "Beo",
  Mint: "Màu bạc hà",
  Peach: "Đào",
  Chocolate: "Sô cô la",
  Gold: "Vàng kim",
  Copper: "Đồng",
  Platinum: "Platinum",
};

export const AVAILABLE_PAYMENT_METHODS = [
  {
    name: "PayPal",
    commission: 0,
    isDefault: true,
  },
  {
    name: "Cash On Delivery",
    commission: 0,
    isDefault: false,
  },
];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";
export const AVAILABLE_DELIVERY_DATES = [
  {
    name: "Hỏa tốc",
    daysToDeliver: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    name: "3 ngày",
    daysToDeliver: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    name: "5 ngày",
    daysToDeliver: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 35,
  },
];
