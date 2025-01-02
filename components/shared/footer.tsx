"use client";

import { ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-black text-white underline-link">
      <div className="w-full">
        <Button
          variant="ghost"
          className="bg-gray-800 w-full rounded-none"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          Quay lại đầu trang
        </Button>
      </div>
      <div className="p-4">
        <div className="flex justify-center gap-3 text-sm">
          <Link prefetch={true} href="/page/conditions-of-use">
            Điều khoản sử dụng
          </Link>
          <Link prefetch={true} href="/page/privacy-policy">
            {" "}
            Thông báo về quyền riêng tư
          </Link>
          <Link prefetch={true} href="/page/help">
            Trợ giúp
          </Link>
        </div>
        <div className="flex justify-center text-sm">
          <p> © 2000-2024, {APP_NAME}</p>
        </div>
        <div className="mt-8 flex justify-center text-sm text-gray-400">
          1 Đinh Tiên Hoàng, Quận 1, TPHCM
        </div>
      </div>
    </footer>
  );
}
