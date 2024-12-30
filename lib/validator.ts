import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const Price = (field: string) =>
  z.coerce
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      `${field} phải có đúng hai chữ số thập phân (ví dụ: 49.99)`
    );

export const ProductInputSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự"),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  images: z.array(z.string()).min(1, "Sản phẩm phải có ít nhất một hình ảnh"),
  brand: z.string().min(1, "Thương hiệu là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  isPublished: z.boolean(),
  price: Price("Giá"),
  listPrice: Price("Giá niêm yết"),
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative("Số lượng trong kho phải là một số không âm"),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  avgRating: z.coerce
    .number()
    .min(0, "Đánh giá trung bình phải ít nhất là 0")
    .max(5, "Đánh giá trung bình phải tối đa là 5"),
  numReviews: z.coerce
    .number()
    .int()
    .nonnegative("Số lượng đánh giá phải là một số không âm"),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5),
  reviews: z.array(z.string()).default([]),
  numSales: z.coerce
    .number()
    .int()
    .nonnegative("Số lượng bán phải là một số không âm"),
});

export const OrderItemSchema = z.object({
  clientId: z.string().min(1, "clientId là bắt buộc"),
  product: z.string().min(1, "Sản phẩm là bắt buộc"),
  name: z.string().min(1, "Tên là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  quantity: z.number().int().nonnegative("Số lượng phải là một số không âm"),
  countInStock: z
    .number()
    .int()
    .nonnegative("Số lượng phải là một số không âm"),
  image: z.string().min(1, "Hình ảnh là bắt buộc"),
  price: Price("Giá"),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const CartSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, "Đơn hàng phải có ít nhất một sản phẩm"),
  itemsPrice: z.number(),
  taxPrice: z.optional(z.number()),
  shippingPrice: z.optional(z.number()),
  totalPrice: z.number(),
  paymentMethod: z.optional(z.string()),
  deliveryDateIndex: z.optional(z.number()),
  expectedDeliveryDate: z.optional(z.date()),
});
