"use server";

import { revalidatePath } from "next/cache";
import * as orderDao from "./dao";
import type { Order } from "./types";

export const create = async (
  order: Omit<Order, "status" | "id" | "created_at" | "updated_at">,
) => {
  await orderDao.insert(order);
  revalidatePath(`/workspaces/${order.workspaceId}`);
};
