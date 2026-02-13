import React from "react";
import { ThemedLayout } from "@refinedev/antd";
import { Header } from "@components/header";
import { CustomSider } from "@components/custom-sider";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <ThemedLayout Header={Header} >
      {children}
    </ThemedLayout>
  );
}
