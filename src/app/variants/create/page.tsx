"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function BlogPostCreate() {
    const { formProps, saveButtonProps } = useForm({
        action: "create",
        resource: "variants",
        redirect: "list",
        mutationMode: "pessimistic",
    });

    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
        optionLabel: "name",
        optionValue: "id",
    });

    const handleFinish = (values: any) => {
        // convert trước khi submit
        const payload = {
            ...values,
            images: [values.images],          // convert string → array
            category_id: Number(values.category_id), // convert string → number
        };

        return formProps.onFinish?.(payload);
    };

    return (
        <Create
            saveButtonProps={{
                ...saveButtonProps,
                children: "Tạo mới sản phẩm",
            }}
        >
            <Form {...formProps} layout="vertical" onFinish={handleFinish}>
                <Form.Item label="Tên sản phẩm" name="title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}>
                    <Input.TextArea rows={5} />
                </Form.Item>

                <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Slug-For-SEO" name="slug" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Bộ sưu tập" name="category_id" rules={[{ required: true }]}>
                    <Select {...categorySelectProps} />
                </Form.Item>

                <Form.Item label="Hình ảnh" name="images" rules={[{ required: true }]}>
                    <Input placeholder="Nhập link ảnh" />
                </Form.Item>
            </Form>
        </Create>
    );
}
