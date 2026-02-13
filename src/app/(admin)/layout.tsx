"use client";

import { useEffect } from "react";
import { useIsAuthenticated, useGetIdentity } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { Spin, Result, Button } from "antd";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: isAuth, isLoading } = useIsAuthenticated();
    const { data: identity } = useGetIdentity();
    const router = useRouter();

    // 🚫 CHƯA LOGIN → LOGIN
    useEffect(() => {
        if (!isLoading && !isAuth) {
            router.replace("/login");
        }
    }, [isAuth, isLoading, router]);

    if (isLoading) return <Spin fullscreen />;

    if (!isAuth) return null;

    // 🚫 KHÔNG PHẢI ADMIN
    if (identity?.role !== "admin") {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Bạn không có quyền truy cập"
                extra={
                    <Button onClick={() => router.replace("/")}>
                        Quay lại
                    </Button>
                }
            />
        );
    }

    // ✅ ADMIN
    return <>{children}</>;
}
