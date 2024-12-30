export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Next.js";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Next.js";
export const APP_SLOGAN = process.env.NEXT_PUBLIC_APP_SLOGAN || "Next.js";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
);
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
