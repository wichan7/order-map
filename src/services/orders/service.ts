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
    address_detail,
    quantity,
    customer_price,
    customer_name,
    entrance_password,
    memo,
    phone,
    delivery_day
  ) VALUES (
   ${order.workspace_id},
   ${order.lat},
   ${order.lng},
   ${order.address},
   ${order.address_detail},
   ${order.quantity},
   ${order.customer_price},
   ${order.customer_name},
   ${order.entrance_password},
   ${order.memo},
   ${order.phone},
   ${order.delivery_day || null}
  )`;
};

const createMany = async (
  orders: Array<Omit<Order, "status" | "id" | "created_at" | "updated_at">>,
) => {
  if (orders.length <= 0) {
    return null;
  }

  const workspaceIds = orders.map((o) => o.workspace_id);
  const lats = orders.map((o) => o.lat);
  const lngs = orders.map((o) => o.lng);
  const addresses = orders.map((o) => o.address);
  const addressDetails = orders.map((o) => o.address_detail);
  const quantities = orders.map((o) => o.quantity);
  const customerPrices = orders.map((o) => o.customer_price);
  const customerNames = orders.map((o) => o.customer_name);
  const entrancePasswords = orders.map((o) => o.entrance_password);
  const memos = orders.map((o) => o.memo);
  const phones = orders.map((o) => o.phone);
  const deliveryDays = orders.map((o) => o.delivery_day || null);

  return await sql`
    INSERT INTO "order" (
      workspace_id,
      lat,
      lng,
      address,
      address_detail,
      quantity,
      customer_price,
      customer_name,
      entrance_password,
      memo,
      phone,
      delivery_day
    )
    SELECT *
    FROM UNNEST(
      ${workspaceIds}::uuid[],
      ${lats}::double precision[],
      ${lngs}::double precision[],
      ${addresses}::text[],
      ${addressDetails}::text[],
      ${quantities}::text[],
      ${customerPrices}::text[],
      ${customerNames}::text[],
      ${entrancePasswords}::text[],
      ${memos}::text[],
      ${phones}::text[],
      ${deliveryDays}::text[]
    )
  `;
};

const modify = async (order: Omit<Order, "">) => {
  return await sql`
  UPDATE "order" 
  SET workspace_id = ${order.workspace_id}
    , lat = ${order.lat}
    , lng = ${order.lng}
    , address = ${order.address}
    , address_detail = ${order.address_detail}
    , quantity = ${order.quantity}
    , customer_price = ${order.customer_price}
    , customer_name = ${order.customer_name}
    , entrance_password = ${order.entrance_password}
    , memo = ${order.memo}
    , phone = ${order.phone}
    , status = ${order.status}
    , delivery_day = ${order.delivery_day || null}
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

const removeAll = async (workspaceId: string) => {
  return await sql`
  DELETE
  FROM "order"
  WHERE workspace_id = ${workspaceId}
  `;
};

const orderService = {
  get,
  getOneById,
  create,
  createMany,
  modify,
  remove,
  removeAll,
};

export default orderService;
