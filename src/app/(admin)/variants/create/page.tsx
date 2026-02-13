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

    const { selectProps: variantIDSelectProps } = useSelect({
        resource: "colors",
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

                <Form.Item label="Màu sắc" name="color" rules={[{ required: true }]}>
                    <Input.TextArea rows={5} />
                </Form.Item>

                <Form.Item label="Kích thước" name="size" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Bộ màu sắc" name="name" rules={[{ required: true }]}>
                    <Select {...variantIDSelectProps} />
                </Form.Item>
                <Form.Item label="Hình ảnh" name="images" rules={[{ required: true }]}>
                    <Input placeholder="Nhập link ảnh" />
                </Form.Item>
            </Form>
        </Create>
    );
}
