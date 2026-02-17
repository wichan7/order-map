"use server";

import customerService from "@/services/customers/service";
import type { Customer } from "@/services/customers/types";

export async function createCustomerAction(customer: Partial<Customer>) {
  await customerService.create(customer as Customer);
}

export async function modifyCustomerAction(customer: Partial<Customer>) {
  await customerService.modify(customer as Customer);
}

export async function removeCustomerAction(id: Customer["id"]) {
  if (!id) throw new Error("Invalid id");

  await customerService.remove(id);
}

export const getCustomersAction = async (userId: string) => {
  return await customerService.get(userId);
};
