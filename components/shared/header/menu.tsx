import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

export default function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="flex items-center gap-3 w-full">
        <Link href="/login" className="flex items-center header-button">
          Xin chào, đăng nhập tại đây!
        </Link>

        <Link href="/cart" className="header-button">
          <div className="flex items-end">
            <ShoppingCartIcon className="h-8 w-8" />
            <span className="font-bold">Giỏ hàng</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}
