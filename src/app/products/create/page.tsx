"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { List, } from "antd";
import React, { useState } from "react";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../api/uploadFile";
import { supabase } from "@app/libs/supabaseClient";
import { Row, Col, Form, Input, Select, Upload, Button, UploadFile, UploadProps } from "antd";


type FileType = Parameters<
  NonNullable<UploadProps["beforeUpload"]>
>[0];
export default function BlogPostCreate() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const resizeImage = (
    file: File,
    width = 1200,
    height = 630
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject();
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject();

        // 👉 crop center
        const scale = Math.max(
          width / img.width,
          height / img.height
        );

        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;

        ctx.drawImage(
          img,
          x,
          y,
          img.width * scale,
          img.height * scale
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject();

            const resizedFile = new File([blob], file.name, {
              type: file.type,
            });

            resolve(resizedFile);
          },
          file.type,
          0.9 // quality
        );
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  const uploadAndSet = async (file: FileType) => {
    try {
      // 🔥 RESIZE TRƯỚC KHI UPLOAD
      const resizedFile = await resizeImage(
        file as File,
        1200,
        630
      );

      const path = await uploadFile(resizedFile);
      console.log("UPLOAD PATH =", path);

      if (!path) return false;

      const currentImages =
        formProps.form?.getFieldValue("images") || [];

      formProps.form?.setFieldValue("images", [
        ...currentImages,
        path,
      ]);

      setFileList((prev) =>
        prev.map((f) =>
          f.uid === file.uid
            ? { ...f, status: "done", url: path }
            : f
        )
      );
    } catch (err) {
      console.error(err);
    }

    return false; // ⛔ chặn upload mặc định của AntD
  };




  const { formProps, saveButtonProps, form } = useForm({
    action: "create",
    resource: "products",
    redirect: "list",
    mutationMode: "pessimistic",
  });


  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
  });

  const handleFinish = async (values: any) => {
    let imageUrl: string | null = null;

    // 1️⃣ Upload ảnh
    if (values.file?.originFileObj) {
      imageUrl = await uploadFile(values.file.originFileObj);
    }
    console.log("values.file =", values.file);
    console.log("originFileObj =", values.file?.originFileObj);
    console.log(
      "is File =",
      values.file?.originFileObj instanceof File
    );
    // 2️⃣ Tạo payload
    const payload = {
      ...values,
      image: imageUrl,
      category_id: Number(values.category_id),
    };

    // 3️⃣ Không gửi object Upload
    delete payload.file;

    // 4️⃣ CHỈ GỌI 1 LẦN
    return formProps.onFinish?.(payload);
  };


  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        children: "Tạo mới sản phẩm",
      }}
      title="Tạo mới sản phẩm"
    >
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        <Row gutter={24}>
          {/* CỘT TRÁI – 16/24 */}
          <Col span={16}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="title"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Slug (SEO)"
                  name="slug"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="slug-san-pham" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={5} placeholder="Mô tả chi tiết sản phẩm" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Giá"
                  name="price"
                  rules={[{ required: true }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Tồn kho"
                  name="instock"
                  rules={[{ required: true }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { label: "Nam", value: "male" },
                      { label: "Nữ", value: "female" },
                      { label: "Unisex", value: "unisex" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Bộ sưu tập"
              name="category_id"
              rules={[{ required: true }]}
            >
              <Select {...categorySelectProps} />
            </Form.Item>
          </Col>

          {/* CỘT PHẢI – 8/24 */}
          <Col span={8}>
            <Form.Item label="Hình ảnh sản phẩm">
              <Upload
                multiple
                listType="picture"
                fileList={fileList}
                beforeUpload={uploadAndSet}
                onRemove={(file) => {
                  setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                }}
                onPreview={(file) => window.open(file.url || "")}
              >
                {fileList.length < 5 && "+ Upload"}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Field ẩn */}
        <Form.Item name="images" hidden>
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Create>


  );
}






