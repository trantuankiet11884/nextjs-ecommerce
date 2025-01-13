"use server";

import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import {
  IUserChangePassword,
  IUserName,
  IUserSignIn,
  IUserSignUp,
} from "@/types";
import { redirect } from "next/navigation";
import { UserSignUpSchema, UserUpdateSchema } from "../validator";
import { connectToDatabase } from "../db";
import User, { IUser } from "../db/models/user.model";
import { formatError } from "../utils";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDatabase();
    const dbUser = await User.findById(user._id);
    if (!dbUser) throw new Error("User not found");
    dbUser.name = user.name;
    dbUser.email = user.email;
    dbUser.role = user.role;
    const updatedUser = await dbUser.save();
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function getUserById(userId: string) {
  await connectToDatabase();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return JSON.parse(JSON.stringify(user)) as IUser;
}

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn("credentials", { ...user, redirect: false });
}
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};
export const SignInWithGoogle = async () => {
  await signIn("google");
};

// CREATE
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });

    await connectToDatabase();
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}

// DELETE
export async function deleteUser(id: string) {
  try {
    await connectToDatabase();
    const res = await User.findByIdAndDelete(id);
    if (!res) throw new Error("Use not found");
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
// GET
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number;
  page: number;
}) {
  limit = limit || PAGE_SIZE;
  await connectToDatabase();
  const skipAmount = (Number(page) - 1) * limit;
  const users = await User.find()
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(limit);
  const usersCount = await User.countDocuments();
  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  };
}

// UPDATE
export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase();
    const session = await auth();
    const currentUser = await User.findById(session?.user?.id);
    if (!currentUser) throw new Error("User not found");
    currentUser.name = user.name;
    const updatedUser = await currentUser.save();
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function changeUserPassword(passwords: IUserChangePassword) {
  try {
    await connectToDatabase();
    const session = await auth();

    // Kiểm tra người dùng đã đăng nhập
    if (!session?.user?.id) {
      throw new Error("Bạn cần đăng nhập để thực hiện thao tác này");
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Kiểm tra mật khẩu cũ
    const isValidPassword = await bcrypt.compare(
      passwords.oldPassword,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Mật khẩu cũ không chính xác");
    }

    // Hash và cập nhật mật khẩu mới
    user.password = await bcrypt.hash(passwords.newPassword, 5);
    await user.save();

    return {
      success: true,
      message: "Đổi mật khẩu thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
