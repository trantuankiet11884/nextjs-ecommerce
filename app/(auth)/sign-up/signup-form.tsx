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
import { IUserSignUp } from "@/types";
import {
  registerUser,
  signInWithCredentials,
} from "@/lib/actions/user.actions";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignUpSchema } from "@/lib/validator";
import { Separator } from "@/components/ui/separator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { APP_NAME } from "@/lib/constants";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";

const signUpDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        name: "john doe",
        email: "john@me.com",
        password: "123456",
        confirmPassword: "123456",
      }
    : {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  });

  const onSubmit = async (data: IUserSignUp) => {
    try {
      const res = await registerUser(data);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
        return;
      }
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      });
      redirect(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Nhập email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    {confirmPasswordVisible ? (
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

        <Button type="submit" className="w-full">
          Đăng ký
        </Button>

        <p className="text-sm">
          Bằng việc tạo tài khoản, bạn đồng ý với{" "}
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
        </p>

        <Separator />

        <p className="text-sm">
          Bạn đã có tài khoản?{" "}
          <Link
            prefetch={true}
            className="text-primary hover:underline"
            href={`/sign-in?callbackUrl=${callbackUrl}`}
          >
            Đăng nhập
          </Link>
        </p>
      </form>
    </Form>
  );
}
