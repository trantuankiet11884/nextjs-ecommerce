import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import ChangePasswordForm from "./ChangePasswordForm";
const PAGE_TITLE = "Đổi mật khẩu";
export const metadata: Metadata = {
  title: PAGE_TITLE,
};
export default async function ProfilePage() {
  const session = await auth();
  return (
    <div className="mb-24">
      <SessionProvider session={session}>
        <div className="flex gap-2 ">
          <Link prefetch={true} href="/account">
            Tài khoản
          </Link>
          <span>›</span>
          <Link prefetch={true} href="/account/manage">
            Đăng nhập và bảo mật
          </Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>
        <h1 className="h1-bold py-4">{PAGE_TITLE}</h1>
        <Card className="max-w-2xl">
          <CardContent className="p-4 flex justify-between flex-wrap">
            <p className="text-sm py-2">
              Nếu bạn muốn thay đổi mật khẩu liên kết với tài khoản của{" "}
              {APP_NAME}, bạn có thể thực hiện việc này bên dưới. Hãy chắc chắn
              nhấn nút Lưu thay đổi khi bạn hoàn tất.
            </p>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  );
}
