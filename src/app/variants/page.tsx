"use client";

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";
import Image from "next/image";
import React from "react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  category_id: number;
}

export default function BlogPostList() {
  const { result, tableProps } = useTable({
    resource: "variants",
    syncWithLocation: true,
  });

  const products = result?.data ?? [];

  // Lấy danh sách category_id
  const categoryIds = products
    .map((item: any) => Number(item.category_id))
    .filter((id) => Number.isFinite(id));

  // Load categories theo list ID
  const {
    result: { data: categoryQuery },
    query: { isLoading: categoryIsLoading },
  } = useMany({
    resource: "categories", // ← ĐÚNG!
    ids: categoryIds,
  });
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <List title="Sản phẩm">
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="title" title="Tên sản phẩm" />
        <Table.Column dataIndex="color" title="Màu sắc" />
        <Table.Column dataIndex="size" title="Kích thước" />
        <Table.Column dataIndex="price" title="Giá" render={formatCurrency} />



        {/* --- Actions --- */}
        <Table.Column
          title="Hành động"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
