import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SeparatorWithOr from "@/components/shared/separator-or";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CredentialsSignInForm from "./credentials-signin-form";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { GoogleSignInForm } from "./google-signin-form";
export const metadata: Metadata = {
  title: "Sign In",
};
export default async function SignIn(props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const { callbackUrl = "/" } = searchParams;
  const session = await auth();
  if (session) {
    return redirect(callbackUrl);
  }
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <CredentialsSignInForm />
          </div>
          <SeparatorWithOr />
          <div className="mt-4">
            <GoogleSignInForm />
          </div>
        </CardContent>
      </Card>
      <SeparatorWithOr>Bạn không có tài khoản tại {APP_NAME}?</SeparatorWithOr>
      <Link
        prefetch={true}
        href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      >
        <Button className="w-full" variant="outline">
          Tạo tài khoản của bạn tại {APP_NAME}
        </Button>
      </Link>
    </div>
  );
}
