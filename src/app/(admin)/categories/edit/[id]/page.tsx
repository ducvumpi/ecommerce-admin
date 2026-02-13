"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import React from "react";

export default function CategoryEdit() {
  const { formProps, saveButtonProps } = useForm({
    action: "edit",
    resource: "categories",
    redirect: "list",
    mutationMode: "pessimistic",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="image"
          rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
}
