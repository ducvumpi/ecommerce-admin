"use client";

import {
  DateField,
  MarkdownField,
  Show,
  TextField,
} from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

export default function BlogPostShow() {
  const { query } = useShow({});
  const record = query.data?.data; // refine v4 trả về { data: {...} }

  const categoryId = record?.category_id;

  // Dùng useOne đúng cách
  const {
    data: categoryData,
    isLoading: categoryIsLoading,
  } = useOne({
    resource: "categories",
    id: categoryId,
    queryOptions: {
      enabled: !!categoryId, // tránh gọi khi null
    },
  });

  return (
    <Show isLoading={query.isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Tên sản phẩm</Title>
      <TextField value={record?.title} />

      <Title level={5}>Mô tả</Title>
      <MarkdownField value={record?.description} />

      <Title level={5}>Bộ sưu tập</Title>
      <TextField
        value={
          categoryIsLoading
            ? "Loading..."
            : categoryData?.data?.name ?? "-"
        }
      />

      <Title level={5}>Ngày khởi tạo</Title>
      <DateField value={record?.created_at} />
    </Show>
  );
}
