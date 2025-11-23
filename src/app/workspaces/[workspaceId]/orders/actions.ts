"use server";

import { redirect } from "next/navigation";
import * as orderDao from "@/services/orders/dao";
import type { Order } from "@/services/orders/types";

export async function createOrderAction(formData: FormData) {
  const dto: Partial<Order> = {
    workspace_id: formData.get("workspace_id")?.toString(),
    phone: formData.get("phone")?.toString(),
    memo: formData.get("memo")?.toString(),
    address: formData.get("address")?.toString(),
    address_road: formData.get("address_road")?.toString(),
    lat: Number(formData.get("lat")),
    lng: Number(formData.get("lng")),
  };

  await orderDao.insert(dto as Order);
  redirect("..");
}

export async function modifyOrderAction(formData: FormData) {
  const dto: Partial<Order> = {
    id: formData.get("id")?.toString(),
    workspace_id: formData.get("workspace_id")?.toString(),
    phone: formData.get("phone")?.toString(),
    memo: formData.get("memo")?.toString(),
    address: formData.get("address")?.toString(),
    address_road: formData.get("address_road")?.toString(),
    status: formData.get("status")?.toString() as Order["status"],
    lat: Number(formData.get("lat")),
    lng: Number(formData.get("lng")),
  };

  await orderDao.update(dto as Order);
  redirect("..");
}

export async function removeOrderAction(formData: FormData) {
  const dto: Partial<Order> = {
    id: formData.get("id")?.toString(),
  };

  await orderDao.del(dto.id!);
  redirect("..");
}

export const getOrdersAction = async (workspaceId: string) => {
  return await orderDao.select(workspaceId);
};
