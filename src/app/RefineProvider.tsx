"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { useNotificationProvider } from "@refinedev/antd";
import { dataProviderSupabase } from "@/app/libs/dataProviders";
import { AppIcon } from "@/components/app-icon";
import { ColorModeContextProvider } from "@/contexts/color-mode";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import React from "react";

interface RefineProviderProps {
    children: React.ReactNode;
    defaultMode: "light" | "dark";
}

export function RefineProvider({ children, defaultMode }: RefineProviderProps) {
    return (
        <RefineKbarProvider>
            <AntdRegistry>
                <ColorModeContextProvider defaultMode={defaultMode}>
                    <Refine
                        routerProvider={routerProvider}
                        dataProvider={dataProviderSupabase}
                        notificationProvider={useNotificationProvider}
                        resources={[
                            {
                                name: "products",
                                list: "/products",
                                create: "/products/create",
                                edit: "/products/edit/:id",
                                show: "/products/show/:id",
                                meta: {
                                    label: "Sản phẩm",
                                    canDelete: true,
                                },
                            },
                            {
                                name: "categories",
                                list: "/categories",
                                create: "/categories/create",
                                edit: "/categories/edit/:id",
                                show: "/categories/show/:id",
                                meta: {
                                    label: "Danh mục",
                                    canDelete: true,
                                },
                            },
                            {
                                name: "variants",
                                list: "/variants",
                                create: "/variants/create",
                                edit: "/variants/edit/:id",
                                show: "/variants/show/:id",
                                meta: {
                                    label: "Màu sắc/Kích thước",
                                    canDelete: true,
                                },
                            },

                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                            projectId: "i0refO-qq8Lp2-3OKL9w",
                            title: { text: "Quản lý sản phẩm", icon: <AppIcon /> },
                        }}
                    >
                        {children}
                        <RefineKbar />
                    </Refine>
                </ColorModeContextProvider>
            </AntdRegistry>
        </RefineKbarProvider >
    );
}
