// pages/orders/show/[id].tsx
import { useShow } from "@refinedev/core";
import {
    Show,
    NumberField,
    TextField,
    DateField,
    EmailField
} from "@refinedev/antd";
import {
    Card,
    Descriptions,
    Space,
    Tag,
    Avatar,
    Timeline,
    Row,
    Col,
    Statistic,
    Divider,
    Table,
    Typography,
    Button
} from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    TruckOutlined,
    PackageOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    FilePdfOutlined,
    PrinterOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const statusConfig = {
    pending: {
        label: 'Chờ xử lý',
        color: 'gold',
        icon: <ClockCircleOutlined />
    },
    processing: {
        label: 'Đang xử lý',
        color: 'blue',
        icon: <PackageOutlined />
    },
    shipping: {
        label: 'Đang giao',
        color: 'purple',
        icon: <TruckOutlined />
    },
    delivered: {
        label: 'Đã giao',
        color: 'green',
        icon: <CheckCircleOutlined />
    },
    cancelled: {
        label: 'Đã hủy',
        color: 'red',
        icon: <ClockCircleOutlined />
    }
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

export const OrderShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const itemColumns = [
        {
            title: 'Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Text strong>{name}</Text>
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center' as const,
        },
        {
            title: 'Đơn Giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right' as const,
            render: (price: number) => formatPrice(price)
        },
        {
            title: 'Thành Tiền',
            key: 'total',
            align: 'right' as const,
            render: (_, item: any) => (
                <Text strong style={{ color: '#6366f1' }}>
                    {formatPrice(item.price * item.quantity)}
                </Text>
            )
        }
    ];

    return (
        <Show
            isLoading={isLoading}
            headerButtons={({ defaultButtons }) => (
                <>
                    {defaultButtons}
                    <Button icon={<FilePdfOutlined />}>Xuất PDF</Button>
                    <Button icon={<PrinterOutlined />}>In Đơn</Button>
                </>
            )}
        >
            <Row gutter={[16, 16]}>
                {/* Order Status & Info */}
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Space>
                                <PackageOutlined />
                                <Text strong>Thông Tin Đơn Hàng</Text>
                            </Space>
                        }
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {/* Status Tags */}
                            <Space size="large">
                                <Tag
                                    color={statusConfig[record?.status]?.color}
                                    icon={statusConfig[record?.status]?.icon}
                                    style={{ fontSize: 14, padding: '6px 16px' }}
                                >
                                    {statusConfig[record?.status]?.label}
                                </Tag>
                                <Tag color={record?.paymentStatus === 'paid' ? 'success' : 'warning'}>
                                    {record?.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </Tag>
                            </Space>

                            <Descriptions bordered column={2}>
                                <Descriptions.Item label="Mã Đơn Hàng" span={2}>
                                    <Text strong style={{ fontFamily: 'monospace', fontSize: 16 }}>
                                        {record?.id}
                                    </Text>
                                </Descriptions.Item>

                                <Descriptions.Item label="Ngày Đặt">
                                    <DateField value={record?.orderDate} format="DD/MM/YYYY HH:mm" />
                                </Descriptions.Item>

                                {record?.deliveryDate && (
                                    <Descriptions.Item label="Ngày Giao">
                                        <DateField value={record?.deliveryDate} format="DD/MM/YYYY HH:mm" />
                                    </Descriptions.Item>
                                )}

                                <Descriptions.Item label="Phương Thức Thanh Toán" span={2}>
                                    <Space>
                                        <CreditCardOutlined />
                                        <Text>{record?.paymentMethod?.toUpperCase()}</Text>
                                    </Space>
                                </Descriptions.Item>

                                {record?.trackingNumber && (
                                    <Descriptions.Item label="Mã Vận Đơn" span={2}>
                                        <Space>
                                            <TruckOutlined />
                                            <Text strong style={{ fontFamily: 'monospace' }}>
                                                {record?.trackingNumber}
                                            </Text>
                                        </Space>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Space>
                    </Card>

                    {/* Customer Info */}
                    <Card
                        title={
                            <Space>
                                <UserOutlined />
                                <Text strong>Thông Tin Khách Hàng</Text>
                            </Space>
                        }
                        style={{ marginTop: 16 }}
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Space size="large">
                                <Avatar
                                    src={record?.customer?.avatar}
                                    size={64}
                                    icon={<UserOutlined />}
                                />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        {record?.customer?.name}
                                    </Title>
                                    <Space direction="vertical" size={4}>
                                        <Space>
                                            <MailOutlined />
                                            <EmailField value={record?.customer?.email} />
                                        </Space>
                                        <Space>
                                            <PhoneOutlined />
                                            <Text>{record?.customer?.phone}</Text>
                                        </Space>
                                    </Space>
                                </div>
                            </Space>

                            <Divider />

                            <div>
                                <Text strong>
                                    <EnvironmentOutlined /> Địa Chỉ Giao Hàng:
                                </Text>
                                <br />
                                <Text style={{ fontSize: 15, marginTop: 8, display: 'block' }}>
                                    {record?.shippingAddress}
                                </Text>
                            </div>
                        </Space>
                    </Card>

                    {/* Order Items */}
                    <Card
                        title={
                            <Space>
                                <PackageOutlined />
                                <Text strong>Sản Phẩm Đã Đặt</Text>
                            </Space>
                        }
                        style={{ marginTop: 16 }}
                    >
                        <Table
                            dataSource={record?.items}
                            columns={itemColumns}
                            pagination={false}
                            rowKey="id"
                            summary={(data) => {
                                const total = data.reduce(
                                    (sum, item) => sum + (item.price * item.quantity),
                                    0
                                );
                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}>
                                                <Text strong style={{ fontSize: 16 }}>Tổng Cộng</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1} align="right">
                                                <Text
                                                    strong
                                                    style={{
                                                        fontSize: 18,
                                                        color: '#6366f1'
                                                    }}
                                                >
                                                    {formatPrice(total)}
                                                </Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    {/* Total Amount */}
                    <Card>
                        <Statistic
                            title={<Text strong style={{ fontSize: 16 }}>Tổng Thanh Toán</Text>}
                            value={record?.total}
                            formatter={(value) => (
                                <Text style={{ color: '#6366f1', fontSize: 32 }}>
                                    {formatPrice(Number(value))}
                                </Text>
                            )}
                            prefix={<DollarOutlined />}
                        />
                    </Card>

                    {/* Order Timeline */}
                    <Card
                        title={
                            <Space>
                                <ClockCircleOutlined />
                                <Text strong>Lịch Sử Đơn Hàng</Text>
                            </Space>
                        }
                        style={{ marginTop: 16 }}
                    >
                        <Timeline
                            items={[
                                {
                                    color: 'green',
                                    children: (
                                        <>
                                            <Text strong>Đơn hàng đã được tạo</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                <DateField
                                                    value={record?.orderDate}
                                                    format="DD/MM/YYYY HH:mm"
                                                />
                                            </Text>
                                        </>
                                    ),
                                },
                                ...(record?.status !== 'pending' ? [{
                                    color: 'blue',
                                    children: (
                                        <>
                                            <Text strong>Đang xử lý</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Đơn hàng đang được chuẩn bị
                                            </Text>
                                        </>
                                    ),
                                }] : []),
                                ...(record?.status === 'shipping' || record?.status === 'delivered' ? [{
                                    color: 'purple',
                                    children: (
                                        <>
                                            <Text strong>Đang vận chuyển</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Mã vận đơn: {record?.trackingNumber}
                                            </Text>
                                        </>
                                    ),
                                }] : []),
                                ...(record?.status === 'delivered' ? [{
                                    color: 'green',
                                    children: (
                                        <>
                                            <Text strong>Đã giao hàng</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                <DateField
                                                    value={record?.deliveryDate}
                                                    format="DD/MM/YYYY HH:mm"
                                                />
                                            </Text>
                                        </>
                                    ),
                                }] : []),
                                ...(record?.status === 'cancelled' ? [{
                                    color: 'red',
                                    children: (
                                        <>
                                            <Text strong>Đơn hàng đã bị hủy</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Lý do: Khách hàng hủy đơn
                                            </Text>
                                        </>
                                    ),
                                }] : []),
                            ]}
                        />
                    </Card>

                    {/* Quick Actions */}
                    <Card
                        title={<Text strong>Thao Tác Nhanh</Text>}
                        style={{ marginTop: 16 }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button type="primary" block icon={<TruckOutlined />}>
                                Cập Nhật Vận Chuyển
                            </Button>
                            <Button block icon={<CheckCircleOutlined />}>
                                Xác Nhận Giao Hàng
                            </Button>
                            <Button danger block>
                                Hủy Đơn Hàng
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </Show>
    );
};