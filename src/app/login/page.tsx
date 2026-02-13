"use client";

import { useLogin } from "@refinedev/core";
import {
    Button,
    Card,
    Form,
    Input,
    Typography,
    message,
} from "antd";
import {
    LockOutlined,
    MailOutlined,
    ShopOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LoginPage() {
    const { mutate: login, isLoading } = useLogin();

    const onFinish = (values: { email: string; password: string }) => {
        login(values, {
            onError: (error) => {
                message.error(error?.message || "Sai tài khoản hoặc mật khẩu");
            },
        });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #ff6a00, #ee0979)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card
                style={{
                    width: 400,
                    borderRadius: 16,
                    boxShadow: "0 20px 40px rgba(0,0,0,.25)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <ShopOutlined style={{ fontSize: 48, color: "#ff6a00" }} />
                    <Title level={3} style={{ marginTop: 8 }}>
                        Admin System
                    </Title>
                    <Text type="secondary">
                        Quản lý bán hàng & đơn đặt
                    </Text>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<MailOutlined />}
                            placeholder="admin@shop.com"
                            autoFocus
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Nhập mật khẩu" }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="••••••••"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        block
                        size="large"
                        style={{
                            background:
                                "linear-gradient(90deg,#ff6a00,#ee0979)",
                            border: "none",
                        }}
                    >
                        Đăng nhập
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
