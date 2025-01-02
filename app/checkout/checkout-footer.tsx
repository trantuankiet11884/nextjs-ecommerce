import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import React from "react";

export default function CheckoutFooter() {
  return (
    <div className="border-t-2 space-y-2 my-4 py-4">
      <p>
        Cần giúp đỡ? Kiểm tra{" "}
        <Link prefetch={true} href="/page/help">
          Trung tâm trợ giúp
        </Link>{" "}
        hoặc{" "}
        <Link prefetch={true} href="/page/contact-us">
          Liên hệ với chúng tôi
        </Link>{" "}
      </p>
      <p>
        Đối với một món hàng đã đặt từ {APP_NAME}: Khi bạn nhấn nút &apos;Đặt
        hàng&apos;, chúng tôi sẽ gửi email xác nhận đã nhận được đơn hàng của
        bạn. Hợp đồng mua hàng của bạn sẽ không hoàn tất cho đến khi chúng tôi
        gửi email thông báo rằng món hàng đã được gửi đi. Bằng cách đặt hàng,
        bạn đồng ý với {APP_NAME}&apos;s{" "}
        <Link prefetch={true} href="/page/privacy-policy">
          chính sách bảo mật
        </Link>{" "}
        và
        <Link prefetch={true} href="/page/conditions-of-use">
          {" "}
          điều khoản sử dụng
        </Link>
        .
      </p>
      <p>
        Trong vòng 30 ngày kể từ khi giao hàng, bạn có thể trả lại hàng hóa mới,
        chưa mở trong tình trạng ban đầu. Có một số ngoại lệ và hạn chế.{" "}
        <Link prefetch={true} href="/page/returns-policy">
          Xem Chính sách trả hàng của {APP_NAME}.
        </Link>
      </p>
    </div>
  );
}
