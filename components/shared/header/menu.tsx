import Link from "next/link";
import CartButton from "./cart-button";

export default function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="flex items-center gap-3 w-full">
        <Link href="/login" className="flex items-center header-button">
          Xin chào, đăng nhập tại đây!
        </Link>

        <CartButton />
      </nav>
    </div>
  );
}
