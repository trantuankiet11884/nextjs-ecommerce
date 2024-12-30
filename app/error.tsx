"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 rounded-lg shadow-xl bg-white max-w-md w-full mx-4 text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Có lỗi xảy ra</h1>
        <p className="text-destructive text-lg mb-6">{error.message}</p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="default"
            size="lg"
            className="transition-all hover:scale-105"
            onClick={() => reset()}
          >
            Thử lại
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="transition-all hover:scale-105"
            onClick={() => (window.location.href = "/")}
          >
            Trở về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
