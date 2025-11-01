"use server";

import { revalidatePath } from "next/cache";
import * as orderDao from "@/features/orders/dao";
import type { Order } from "@/features/orders/types";

export const createOrderAction = async (
  order: Omit<Order, "status" | "id" | "created_at" | "updated_at">,
) => {
  await orderDao.insert(order);
  revalidatePath(`/workspaces/${order.workspaceId}`);
};
