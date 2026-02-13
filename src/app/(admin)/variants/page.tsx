"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table, Tag } from "antd";
import React, { useMemo } from "react";

export default function BlogPostList() {
  const { tableProps, result } = useTable({
    resource: "variants",
  });

  const variants = result?.data ?? [];

  /* ================== LẤY ID ================== */
  const productIds = Array.from(new Set(variants.map((v: any) => v.product_id)));
  const colorIds = Array.from(new Set(variants.map((v: any) => v.color_id)));
  const sizeIds = Array.from(new Set(variants.map((v: any) => v.size_id)));

  /* ================== LOAD DATA ================== */
  const { result: productsResult } = useMany({
    resource: "products",
    ids: productIds,
    queryOptions: { enabled: productIds.length > 0 },
  });
  const productsData = productsResult?.data;

  const { result: colorsResult } = useMany({
    resource: "colors",
    ids: colorIds,
    queryOptions: { enabled: colorIds.length > 0 },
  });
  const colorsData = colorsResult?.data;

  const { result: sizesResult } = useMany({
    resource: "sizes",
    ids: sizeIds,
    queryOptions: { enabled: sizeIds.length > 0 },
  });
  const sizesData = sizesResult?.data;

  /* ================== MAP ID → NAME ================== */
  const productMap = useMemo(() => {
    const map: Record<number, string> = {};
    productsData?.forEach((p: any) => {
      map[p.id] = p.title;
    });
    return map;
  }, [productsData]);
  const colorMap = useMemo(() => {
    const map: Record<number, string> = {};
    colorsData?.forEach((c: any) => {
      map[c.id] = c.name;
    });
    return map;
  }, [colorsData]);

  const sizeMap = useMemo(() => {
    const map: Record<number, string> = {};
    sizesData?.forEach((s: any) => {
      map[s.id] = s.name;
    });
    return map;
  }, [sizesData]);

  const groupedVariants = useMemo(() => {
    const map: Record<number, any> = {};

    variants.forEach((v: any) => {
      if (!map[v.product_id]) {
        map[v.product_id] = {
          product_id: v.product_id,
          prices: new Set<number>(),
          colorSizeMap: {},
          variantIds: [],
        };
      }

      map[v.product_id].prices.add(v.price);

      if (!map[v.product_id].colorSizeMap[v.color_id]) {
        map[v.product_id].colorSizeMap[v.color_id] = {};
      }

      map[v.product_id].colorSizeMap[v.color_id][v.size_id] = {
        stock: v.stock,
        variantId: v.id,
      };

      map[v.product_id].variantIds.push(v.id);
    });

    return Object.values(map).map((item: any) => ({
      product_id: item.product_id,
      prices: Array.from(item.prices),
      colorSizeMap: item.colorSizeMap, // ✅ GIỮ NGUYÊN
      variantIds: item.variantIds,
    }));
  }, [variants]);


  /* ================== FORMAT ================== */
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <List title="Danh sách variants">
      <Table dataSource={groupedVariants} rowKey="product_id">

        {/* ===== STT ===== */}
        <Table.Column
          title="STT"
          width={70}
          align="center"
          render={(_value, _record, index) =>
            ((tableProps.pagination?.current || 1) - 1) *
            (tableProps.pagination?.pageSize || 10) +
            index +
            1
          }
        />

        <Table.Column
          title="Sản phẩm"
          dataIndex="product_id"
          render={(id: number) => productMap[id] ?? id}
        />




        <Table.Column
          title="Màu – Size – Tồn"
          render={(_, record: any) => (
            <Space direction="vertical" size={4}>
              {Object.entries(record.colorSizeMap ?? {}).map(
                ([colorId, sizes]: any) => (
                  <Space key={colorId} wrap>
                    <Tag color="blue">{colorMap[colorId]}</Tag>

                    {Object.entries(sizes).map(([sizeId, info]: any) => {
                      const color =
                        info.stock === 0
                          ? "red"
                          : info.stock <= 5
                            ? "orange"
                            : "green";

                      return (
                        <Tag key={sizeId} color={color}>
                          {sizeMap[sizeId]}: {info.stock}
                        </Tag>
                      );
                    })}
                  </Space>
                )
              )}
            </Space>
          )}
        />





        <Table.Column
          title="Giá"
          render={(_, record: any) =>
            record.prices.length === 1
              ? formatCurrency(record.prices[0])
              : `${formatCurrency(Math.min(...record.prices))} - ${formatCurrency(Math.max(...record.prices))}`
          }
        />


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
