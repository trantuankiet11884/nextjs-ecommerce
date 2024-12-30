"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 rounded-lg shadow-xl bg-white max-w-md w-full mx-4 text-center animate-fade-in">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Trang bạn truy cập hiện không có
        </h1>
        <p className="text-destructive text-lg mb-6">
          Không thể tìm thấy tài nguyên được yêu cầu
        </p>
        <Button
          variant="default"
          size="lg"
          className="mt-2 transition-all hover:scale-105"
          onClick={() => (window.location.href = "/")}
        >
          Trở về trang chủ
        </Button>
      </div>
    </div>
  );
}
