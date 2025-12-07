import { sql } from "@/core/db";
import type { Order } from "@/services/orders/types";

const get = async (workspaceId: string) => {
  return (await sql`SELECT * FROM "order" WHERE workspace_id = ${workspaceId} ORDER BY created_at DESC`) as Order[];
};

const getOneById = async (orderId: string) => {
  return (await sql`SELECT * FROM "order" WHERE id = ${orderId} LIMIT 1`)[0] as
    | Order
    | undefined;
};

const create = async (
  order: Omit<Order, "status" | "id" | "created_at" | "updated_at">,
) => {
  return await sql`
  INSERT INTO "order" (
    workspace_id,
    lat,
    lng,
    address,
    memo,
    phone
  ) VALUES (
   ${order.workspace_id},
   ${order.lat},
   ${order.lng},
   ${order.address},
   ${order.memo},
   ${order.phone}
  )`;
};

const createMany = async (
  orders: Array<Omit<Order, "status" | "id" | "created_at" | "updated_at">>,
) => {
  if (orders.length <= 0) {
    return null;
  }

  const values = orders.map(
    (o) => sql`(
      ${o.workspace_id},
      ${o.lat},
      ${o.lng},
      ${o.address},
      ${o.memo},
      ${o.phone}
    )`,
  );

  return await sql`
    INSERT INTO "order" (
      workspace_id,
      lat,
      lng,
      address,
      memo,
      phone
    ) VALUES ${values.join(",")}
  `;
};

const modify = async (order: Omit<Order, "">) => {
  return await sql`
  UPDATE "order" 
  SET workspace_id = ${order.workspace_id}
    , lat = ${order.lat}
    , lng = ${order.lng}
    , address = ${order.address}
    , memo = ${order.memo}
    , phone = ${order.phone}
    , status = ${order.status}
    , updated_at = NOW()
  WHERE id = ${order.id}
  `;
};

const remove = async (orderId: string) => {
  return await sql`
  DELETE
  FROM "order"
  WHERE id = ${orderId}
  `;
};

const orderService = { get, getOneById, create, createMany, modify, remove };

export default orderService;
