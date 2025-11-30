"use server";

import { redirect } from "next/navigation";
import orderService from "@/services/orders/service";
import type { Order } from "@/services/orders/types";
import tmapService from "@/services/tmap/service";

export async function createOrderAction(order: Partial<Order>) {
  await orderService.create(order as Order);
  redirect("..");
}

export async function modifyOrderAction(order: Partial<Order>) {
  await orderService.modify(order as Order);
  redirect("..");
}

export async function removeOrderAction(id: Order["id"]) {
  if (!id) throw new Error("Invalid id");

  await orderService.remove(id);
  redirect("..");
}

export const getOrdersAction = async (workspaceId: string) => {
  return await orderService.get(workspaceId);
};
