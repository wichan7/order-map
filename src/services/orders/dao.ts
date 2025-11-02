import { sql } from "@/core/db";
import type { Order } from "@/services/orders/types";

export const select = async (workspaceId: string) => {
  return (await sql`SELECT * FROM "order" WHERE workspace_id = ${workspaceId}`) as Order[];
};

export const insert = async (
  order: Omit<Order, "status" | "id" | "created_at" | "updated_at">,
) => {
  return await sql`
  INSERT INTO "order" (
    workspace_id,
    lat,
    lng,
    address,
    address_road,
    memo
  ) VALUES (
   ${order.workspaceId},
   ${order.lat},
   ${order.lng},
   ${order.address},
   ${order.address_road},
   ${order.memo}
  )`;
};
