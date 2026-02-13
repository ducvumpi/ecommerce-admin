"use client";
import React, { useState } from 'react';
import { Table, Space, Tag, Input, Select, Card, Row, Col, Statistic, DatePicker, Modal, Form, Typography, Button, Dropdown, message } from "antd";
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { useSelect } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "../../libs/supabaseClient";
interface Order {
  id: number;
  orderNumber: string;
  receiver_name: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
  quantity: number;
  receiver_phone: string;
  receiver_address: string;
}
const { Title, Text } = Typography;
const orderstest = [
  {
    id: 1,
    order_code: "DH001",
    customer_name: "Nguyễn Văn A",
    phone: "0909123456",
    total_amount: 1500000,
    status: "Đã thanh toán",
    created_at: "2026-01-25",
  },
];

// Mock data
// const initialOrders = [
//   { id: 1, orderNumber: 'ORD001', customerName: 'Nguyễn Văn A', email: 'nguyenvana@email.com', total: 1250000, status: 'pending', date: '2025-01-20', items: 3, phone: '0901234567', address: 'Hà Nội' },
//   { id: 2, orderNumber: 'ORD002', customerName: 'Trần Thị B', email: 'tranthib@email.com', total: 2500000, status: 'processing', date: '2025-01-19', items: 5, phone: '0902234567', address: 'Hồ Chí Minh' },
//   { id: 3, orderNumber: 'ORD003', customerName: 'Lê Văn C', email: 'levanc@email.com', total: 850000, status: 'shipped', date: '2025-01-18', items: 2, phone: '0903234567', address: 'Đà Nẵng' },
//   { id: 4, orderNumber: 'ORD004', customerName: 'Phạm Thị D', email: 'phamthid@email.com', total: 3200000, status: 'delivered', date: '2025-01-17', items: 7, phone: '0904234567', address: 'Hải Phòng' },
//   { id: 5, orderNumber: 'ORD005', customerName: 'Hoàng Văn E', email: 'hoangvane@email.com', total: 950000, status: 'cancelled', date: '2025-01-16', items: 1, phone: '0905234567', address: 'Cần Thơ' },
//   { id: 6, orderNumber: 'ORD006', customerName: 'Đỗ Thị F', email: 'dothif@email.com', total: 1750000, status: 'pending', date: '2025-01-20', items: 4, phone: '0906234567', address: 'Huế' },
//   { id: 7, orderNumber: 'ORD007', customerName: 'Vũ Văn G', email: 'vuvang@email.com', total: 4200000, status: 'processing', date: '2025-01-19', items: 6, phone: '0907234567', address: 'Nha Trang' },
//   { id: 8, orderNumber: 'ORD008', customerName: 'Bùi Thị H', email: 'buithih@email.com', total: 1100000, status: 'shipped', date: '2025-01-18', items: 2, phone: '0908234567', address: 'Vũng Tàu' },
// ];



const OrderList = () => {
  const { tableProps } = useTable({
    resource: "orders",
    meta: {
      select: `
      id,
      receiver_name,
      quantity,
      total_amount,
      created_at,
      status:order_statuses (
        id,
        code,
        name,
        color
      )
    `,
    },
  });

  // const { selectProps } = useSelect({
  //   resource: "order_statuses",
  //   optionLabel: "label", // hiển thị
  //   optionValue: "id",    // value lưu vào DB
  // });
  const [orders, setOrders] = useState<Order[]>([]);
  // const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'gold',
      processing: 'blue',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };
  const getStatusIcon = (code: string) => {
    const map: Record<string, React.ReactNode> = {
      pending: <ClockCircleOutlined />,
      processing: <SyncOutlined spin />,
      shipped: <CarOutlined />,
      delivered: <CheckCircleOutlined />,
      cancelled: <CloseCircleOutlined />,
    };
    return map[code];
  };
  const getStatusStyle = (id: number) => {
    switch (id) {
      case 1: return { color: "gold", icon: <ClockCircleOutlined /> };
      case 2: return { color: "orange", icon: <ClockCircleOutlined /> };
      case 3: return { color: "blue", icon: <CheckCircleOutlined /> };
      case 4: return { color: "purple", icon: <SyncOutlined spin /> };
      case 5: return { color: "cyan", icon: <CarOutlined /> };
      case 6: return { color: "green", icon: <CheckCircleOutlined /> };
      case 7: return { color: "red", icon: <CloseCircleOutlined /> };
      default: return { color: "default", icon: <ClockCircleOutlined /> };
    }
  };

  const { data, isLoading } = useList({
    resource: "orders",
    pagination: { mode: "off" }, // lấy tất cả
  });
  const getStatusText = (status) => {
    const labels = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã gửi hàng',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  // const getStatusIcon = (status) => {
  //   const icons = {
  //     pending: <ClockCircleOutlined />,
  //     processing: <SyncOutlined spin />,
  //     shipped: <CarOutlined />,
  //     delivered: <CheckCircleOutlined />,
  //     cancelled: <CloseCircleOutlined />
  //   };
  //   return icons[status];
  // };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const result = {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };

    if (!data?.data) return result;

    result.total = data.data.length;

    data.data.forEach((order) => {
      if (order.status in result) {
        result[order.status]++;
      }
    });

    return result;
  }, [data]);
  const statusOptions = [
    { value: 1, label: "Chờ xác nhận" },
    { value: 2, label: "Chờ thanh toán" },
    { value: 3, label: "Đã thanh toán" },
    { value: 4, label: "Đang đóng gói" },
    { value: 5, label: "Đang giao" },
    { value: 6, label: "Hoàn thành" },
    { value: 7, label: "Đã hủy" },
  ];

  const handleChangeStatus = async (orderId: number, statusId: number) => {

    // 1. UPDATE UI NGAY LẬP TỨC (optimistic UI)
    setOrders(prev =>
      prev.map((o: any) =>
        o.id === orderId
          ? {
            ...o,
            status: {
              ...o.status,
              id: statusId,
              name: statusOptions.find(s => s.value === statusId)?.label,
            },
          }
          : o
      )
    );

    // 2. Gọi API ngầm
    const { error } = await supabase
      .from("orders")
      .update({ status_id: statusId })
      .eq("id", orderId);

    // 3. Nếu lỗi → rollback lại
    if (error) {
      message.error("Cập nhật thất bại");

      // reload lại 1 bản ghi để chắc ăn
      const { data } = await supabase
        .from("orders")
        .select(`
        id,
        status:order_statuses (
          id,
          code,
          name,
          color
        )
      `)
        .eq("id", orderId)
        .single();

      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, ...data } : o))
      );

      return;
    }

    message.success("Đã cập nhật trạng thái");
  };

  // Filter orders
  // React.useEffect(() => {
  //   let result = orders;

  //   if (searchText) {
  //     result = result.filter(order =>
  //       order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
  //       order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
  //       order.email.toLowerCase().includes(searchText.toLowerCase())
  //     );
  //   }

  //   if (statusFilter) {
  //     result = result.filter(order => order.status === statusFilter);
  //   }

  //   setFilteredOrders(result);
  // }, [searchText, statusFilter, orders]);

  const handleView = (record) => {
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedOrder(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa đơn hàng ${record.orderNumber}?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setOrders(orders.filter(o => o.id !== record.id));
        message.success('Đã xóa đơn hàng thành công!');
      },
    });
  };

  const handleUpdateStatus = (values) => {
    setOrders(orders.map(o =>
      o.id === selectedOrder.id ? { ...o, ...values } : o
    ));
    setIsEditModalVisible(false);
    message.success('Cập nhật đơn hàng thành công!');
  };
  const handleExport = () => {
    if (!orderstest || orderstest.length === 0) {
      message.warning("Không có dữ liệu để xuất Excel");
      return;
    }

    // Chuẩn hóa dữ liệu cho Excel
    const exportData = orderstest.map((order, index) => ({
      "STT": index + 1,
      "Mã đơn hàng": order.order_code,
      "Khách hàng": order.customer_name,
      "Số điện thoại": order.phone,
      "Tổng tiền": order.total_amount,
      "Trạng thái": order.status,
      "Ngày tạo": order.created_at,
    }));

    // Tạo worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách đơn hàng");

    // Xuất file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `don-hang-${Date.now()}.xlsx`);
  };


  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <ShoppingCartOutlined /> Quản lý đơn hàng
        </Title>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          style={{ float: 'right', marginTop: -40 }}
        >
          Xuất Excel
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Đã gửi hàng"
              value={stats.shipped}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Đã giao"
              value={stats.delivered}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm theo mã đơn, khách hàng..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: '100%' }}
                allowClear
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Select.Option value="pending">Chờ xử lý</Select.Option>
                <Select.Option value="processing">Đang xử lý</Select.Option>
                <Select.Option value="shipped">Đã gửi hàng</Select.Option>
                <Select.Option value="delivered">Đã giao</Select.Option>
                <Select.Option value="cancelled">Đã hủy</Select.Option>
              </Select>

            </Col>
            <Col xs={24} sm={12} md={8}>
              <DatePicker.RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} />
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title="Mã đơn"
            render={(v) => <Text strong>{v}</Text>}
          />

          <Table.Column dataIndex="receiver_name" title="Khách hàng" />
          <Table.Column dataIndex="email" title="Email" />


          <Table.Column
            dataIndex="created_at"
            title="Ngày đặt"
            render={(value) => dayjs(value).format("DD/MM/YYYY")}
          />
          <Table.Column dataIndex="quantity" title="Số lượng" />

          <Table.Column
            dataIndex="total_amount"
            title="Tổng tiền"
            render={(v) => (
              <Text strong>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(v)}
              </Text>
            )}
          />



          <Table.Column
            title="Trạng thái"
            render={(_, record: any) => {
              const status = record.status;

              if (!status) {
                return <Tag>Chưa xác định</Tag>;
              }

              const current = getStatusStyle(status.id);

              return (
                <Select
                  value={status.id}
                  style={{ width: 170 }}
                  onChange={(value) => handleChangeStatus(record.id, value)}
                  dropdownStyle={{ padding: 6 }}
                  options={statusOptions.map((s) => {
                    const st = getStatusStyle(s.value);

                    return {
                      value: s.value,
                      label: (
                        <Tag
                          icon={st.icon}
                          color={st.color}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            borderRadius: 8,
                            padding: "4px 6px",
                          }}
                        >
                          {s.label}
                        </Tag>
                      ),
                    };
                  })}
                  // style hiển thị khi đã chọn
                  optionLabelProp="label"
                  bordered={false}
                  className="status-select"
                  dropdownRender={(menu) => (
                    <div style={{ padding: 4 }}>{menu}</div>
                  )}
                />
              );
            }}
          />


        </Table>

        <Table.Column
          title="Thao tác"
          render={(_, record) => (
            <Space>
              <Button icon={<EyeOutlined />} />
              {/* <Button icon={<EditOutlined />} />
                <Button danger icon={<DeleteOutlined />} /> */}
            </Space>
          )}
        />
      </Card>

      {/* View Modal */}
      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.orderNumber || ''}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedOrder && (
          <div>
            <Card title="Thông tin khách hàng" style={{ marginBottom: 16 }}>
              <p><strong>Họ tên:</strong> {selectedOrder.receiver_name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.receiver_phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.receiver_address}</p>
            </Card>
            <Card title="Thông tin đơn hàng">
              <p><strong>Mã đơn:</strong> {selectedOrder.orderNumber}</p>
              <p><strong>Ngày đặt:</strong> {selectedOrder.date}</p>
              <p><strong>Số lượng sản phẩm:</strong> {selectedOrder.quantity}</p>
              <p><strong>Tổng tiền:</strong> <Text strong style={{ color: '#1890ff', fontSize: 18 }}>{formatCurrency(selectedOrder.total)}</Text></p>
              <p><strong>Trạng thái:</strong> <Tag icon={getStatusIcon(selectedOrder.status)} color={getStatusColor(selectedOrder.status)}>
                {getStatusText(selectedOrder.status)}
              </Tag></p>
            </Card>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={`Chỉnh sửa đơn hàng ${selectedOrder?.orderNumber || ''}`}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateStatus}
        >
          <Form.Item
            name="status"
            label="Trạng thái đơn hàng"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="pending">
                <Tag icon={<ClockCircleOutlined />} color="gold">Chờ xử lý</Tag>
              </Select.Option>
              <Select.Option value="processing">
                <Tag icon={<SyncOutlined spin />} color="blue">Đang xử lý</Tag>
              </Select.Option>
              <Select.Option value="shipped">
                <Tag icon={<CarOutlined />} color="purple">Đã gửi hàng</Tag>
              </Select.Option>
              <Select.Option value="delivered">
                <Tag icon={<CheckCircleOutlined />} color="green">Đã giao</Tag>
              </Select.Option>
              <Select.Option value="cancelled">
                <Tag icon={<CloseCircleOutlined />} color="red">Đã hủy</Tag>
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const App = () => {
  return <OrderList />;
};

export default App;