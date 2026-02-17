import { sql } from "@/core/db";
import type { Customer } from "@/services/customers/types";

const get = async (userId: string) => {
  return (await sql`SELECT * FROM "customer" WHERE user_id = ${userId} ORDER BY created_at DESC`) as Customer[];
};

const getOneById = async (customerId: string) => {
  return (await sql`SELECT * FROM "customer" WHERE id = ${customerId} LIMIT 1`)[0] as
    | Customer
    | undefined;
};

const create = async (
  customer: Omit<Customer, "id" | "created_at" | "updated_at">,
) => {
  return await sql`
  INSERT INTO "customer" (
    user_id,
    name,
    phone,
    entrance_password,
    address,
    address_detail,
    lat,
    lng
  ) VALUES (
   ${customer.user_id},
   ${customer.name},
   ${customer.phone},
   ${customer.entrance_password},
   ${customer.address},
   ${customer.address_detail},
   ${customer.lat},
   ${customer.lng}
  )`;
};

const modify = async (customer: Customer) => {
  return await sql`
  UPDATE "customer"
  SET name = ${customer.name}
    , phone = ${customer.phone}
    , entrance_password = ${customer.entrance_password}
    , address = ${customer.address}
    , address_detail = ${customer.address_detail}
    , lat = ${customer.lat}
    , lng = ${customer.lng}
    , updated_at = NOW()
  WHERE id = ${customer.id}
  `;
};

const remove = async (customerId: string) => {
  return await sql`
  DELETE
  FROM "customer"
  WHERE id = ${customerId}
  `;
};

const customerService = {
  get,
  getOneById,
  create,
  modify,
  remove,
};

export default customerService;
