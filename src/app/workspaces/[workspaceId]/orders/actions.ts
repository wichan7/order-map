"use server";

import orderService from "@/services/orders/service";
import type { Order } from "@/services/orders/types";

export async function createOrderAction(order: Partial<Order>) {
  await orderService.create(order as Order);
}

export async function modifyOrderAction(order: Partial<Order>) {
  await orderService.modify(order as Order);
}

export async function removeOrderAction(id: Order["id"]) {
  if (!id) throw new Error("Invalid id");

  await orderService.remove(id);
}

export const getOrdersAction = async (workspaceId: string) => {
  return await orderService.get(workspaceId);
};

export async function createOrdersBulkAction(
  orders: Array<Omit<Order, "status" | "id" | "created_at" | "updated_at">>,
) {
  await orderService.createMany(orders);
}
