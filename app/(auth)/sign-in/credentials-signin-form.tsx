"use client";
import { redirect, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { IUserSignIn } from "@/types";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignInSchema } from "@/lib/validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { APP_NAME } from "@/lib/constants";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const signInDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        email: "admin@gmail.com",
        password: "123456",
      }
    : {
        email: "",
        password: "",
      };

export default function CredentialsSignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: IUserSignIn) => {
    try {
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      });
      toast.success("Đăng nhập thành công");
      redirect(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      console.log(error);
      toast.error("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Nhập email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </div>
          <div className="text-sm">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <Link
              prefetch={true}
              href="/page/conditions-of-use"
              className="text-primary hover:underline"
            >
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link
              prefetch={true}
              href="/page/privacy-policy"
              className="text-primary hover:underline"
            >
              Chính sách bảo mật
            </Link>{" "}
            của {APP_NAME}.
          </div>
        </div>
      </form>
    </Form>
  );
}
