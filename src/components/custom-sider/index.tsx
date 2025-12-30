"use client";

import { Layout, Menu } from "antd";
import { useMenu } from "@refinedev/core";
import Link from "next/link";

const { Sider } = Layout;

export const CustomSider = () => {
    const { menuItems, selectedKey } = useMenu();

    return (
        <Sider>
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems.map((item) => ({
                    key: item.key,
                    icon: item.icon,
                    label: (
                        <Link href={item.route ?? "#"}>
                            {item.meta?.label ?? item.label}
                        </Link>
                    ),
                }))}
            />
        </Sider>
    );
};
