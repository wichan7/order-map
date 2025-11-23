import { sql } from "@/core/db";
import type { Order } from "@/services/orders/types";

export const select = async (workspaceId: string) => {
  return (await sql`SELECT * FROM "order" WHERE workspace_id = ${workspaceId} ORDER BY created_at DESC`) as Order[];
};

export const selectById = async (orderId: string) => {
  return (await sql`SELECT * FROM "order" WHERE id = ${orderId} LIMIT 1`)[0] as
    | Order
    | undefined;
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
    memo,
    phone
  ) VALUES (
   ${order.workspace_id},
   ${order.lat},
   ${order.lng},
   ${order.address},
   ${order.address_road},
   ${order.memo},
   ${order.phone}
  )`;
};

export const update = async (order: Omit<Order, "">) => {
  return await sql`
  UPDATE "order" 
  SET workspace_id = ${order.workspace_id}
    , lat = ${order.lat}
    , lng = ${order.lng}
    , address = ${order.address}
    , address_road = ${order.address_road}
    , memo = ${order.memo}
    , phone = ${order.phone}
    , status = ${order.status}
  WHERE id = ${order.id}
  `;
};

export const del = async (orderId: string) => {
  return await sql`
  DELETE
  FROM "order"
  WHERE id = ${orderId}
  `;
};
