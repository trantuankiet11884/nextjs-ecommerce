"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
const links = [
  {
    title: "Tổng quan",
    href: "/admin/overview",
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
  },
  {
    title: "Người dùng",
    href: "/admin/users",
  },
  {
    title: "Truy cập web",
    href: "/admin/web-pages",
  },
];
export function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "flex items-center flex-wrap overflow-hidden gap-2 md:gap-4",
        className
      )}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "",
            pathname.includes(item.href) ? "" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
