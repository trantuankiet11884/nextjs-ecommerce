import { auth } from "@/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOut } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
export default async function UserButton() {
  const session = await auth();
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="header-button" asChild>
          <div className="flex items-center">
            <div className="flex flex-col text-xs text-left">
              <span>
                Hello, {session ? session.user.name : "bạn chưa đăng nhập?"}
              </span>
            </div>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>
        {session ? (
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <Link className="w-full cursor-pointer" href="/account">
                <DropdownMenuItem>Tài khoản</DropdownMenuItem>
              </Link>
              <Link className="w-full cursor-pointer" href="/account/orders">
                <DropdownMenuItem>Đơn hàng của bạn</DropdownMenuItem>
              </Link>
              {session.user.role === "Admin" && (
                <Link className="w-full cursor-pointer" href="/admin/overview">
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem className="p-0 mb-1">
              <form action={SignOut} className="w-full cursor-pointer">
                <Button
                  className="w-full py-4 px-2 h-4 justify-start"
                  variant="ghost"
                >
                  Đăng xuất
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  className={cn(buttonVariants(), "w-full")}
                  href="/sign-in"
                >
                  Đăng nhập
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="font-normal">
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ variant: "destructive" }),
                    "w-full"
                  )}
                >
                  Đăng ký
                </Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
