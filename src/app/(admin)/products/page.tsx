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
    resource: "products",
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
        <Table.Column dataIndex="description" title="Mô tả" />
        <Table.Column dataIndex="price" title="Giá" render={formatCurrency} />

        {/* --- Category --- */}
        <Table.Column
          title="Bộ sưu tập"
          render={(record: Product) => {
            if (categoryIsLoading) return "Đang tải...";

            const categories = (categoryQuery ?? []) as Category[];

            const cat = categories.find(
              (item: Category) => item.id === record.category_id
            );

            return cat?.name ?? "-";
          }}
        />

        {/* --- Image list --- */}
        <Table.Column
          title="Hình ảnh"
          dataIndex="images"
          render={(images: string[] | string | null) => {
            if (!images) return null;

            let list: string[] = [];
            try {
              list = typeof images === "string" ? JSON.parse(images) : images;
            } catch {
              list = [];
            }

            return (
              <>
                {list?.map((img, index) =>
                  typeof img === "string" && img && (
                    <Image
                      key={index}
                      src={img}
                      alt=""
                      width={50}
                      height={50}
                      style={{ marginRight: 8, borderRadius: 6 }}
                    />
                  )
                )}

              </>
            );
          }}
        />
        <Table.Column dataIndex="instock" title="Số lượng tồn kho" />
        {/* --- Date --- */}
        <Table.Column
          dataIndex="created_at"
          title="Ngày khởi tạo"
          render={(value: any) => <DateField value={value} />}
        />

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
