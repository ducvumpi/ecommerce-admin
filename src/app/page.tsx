"use client";

import { Suspense, useEffect } from "react";
import { Authenticated, useGetIdentity } from "@refinedev/core";
import { Spin, Result, Button } from "antd";
import { useRouter } from "next/navigation";
import { NavigateToResource } from "@refinedev/nextjs-router";

function AdminGate() {
  const { data: identity, isLoading } = useGetIdentity();
  const router = useRouter();

  // 🔁 redirect effect
  useEffect(() => {
    if (!isLoading && !identity) {
      router.replace("/login");
    }
  }, [identity, isLoading, router]);

  // ⏳ loading
  if (isLoading) {
    return <Spin fullscreen />;
  }

  // ⛔ chưa login → không render gì (đã redirect)
  if (!identity) {
    return null;
  }

  // ⛔ không phải admin
  if (identity.role !== "admin") {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập"
        extra={
          <Button onClick={() => router.replace("/login")}>
            Quay lại đăng nhập
          </Button>
        }
      />
    );
  }

  // ✅ admin → resource đầu tiên
  return <NavigateToResource />;
}

export default function IndexPage() {
  return (
    <Suspense fallback={<Spin />}>
      <Authenticated key="authenticated">
        <AdminGate />
      </Authenticated>
    </Suspense>
  );
}
