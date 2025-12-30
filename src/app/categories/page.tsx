"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import React from "react";
import Image from "next/image";
export default function CategoryList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List title={"Danh mục sản phẩm"}>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Tên sản phẩm"} />
        <Table.Column dataIndex="image" title={"Hình ảnh"} key="image"
          render={(value) => (
            <Image alt="" width={50} height={50} src={value} />
          )}
        />

        <Table.Column
          title={"Hành động"}
          dataIndex="actions"
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
