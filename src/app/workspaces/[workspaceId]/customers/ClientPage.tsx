"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/server/Button";
import type { Customer } from "@/services/customers/types";
import { getCustomersAction } from "./actions";

interface Props {
  workspaceId: string;
  userId: string;
}

const CustomerCard = ({
  customer,
  workspaceId,
}: {
  customer: Customer;
  workspaceId: string;
}) => (
  <Link
    href={`/workspaces/${workspaceId}/customers/${customer.id}`}
    className="block"
  >
    <li className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group cursor-pointer">
      <div className="flex justify-between items-start mb-3 border-b pb-2">
        <h2 className="text-lg font-bold text-blue-600 group-hover:text-blue-700 truncate mr-4">
          {customer.name}
        </h2>
      </div>

      <div className="text-sm space-y-1 mb-3">
        {customer.phone && (
          <p className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-500">전화번호:</span>
            <span>{customer.phone}</span>
          </p>
        )}
        {customer.address && (
          <p className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-500">주소:</span>
            <span className="truncate ml-2">{customer.address}</span>
          </p>
        )}
        {customer.unit_price && (
          <p className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-500">단가:</span>
            <span>{Number(customer.unit_price).toLocaleString()}원</span>
          </p>
        )}
        {customer.delivery_day && (
          <p className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-500">배송 요일:</span>
            <span>{customer.delivery_day}</span>
          </p>
        )}
        {customer.updated_at && (
          <p className="flex justify-between text-gray-500">
            <span className="font-medium">수정 일시:</span>
            <span>{customer.updated_at}</span>
          </p>
        )}
      </div>
    </li>
  </Link>
);

export default function ClientPage({ workspaceId, userId }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const loadCustomers = useCallback(async () => {
    const result = await getCustomersAction(userId);
    setCustomers([...result].sort((a, b) => a.name.localeCompare(b.name, "ko")));
  }, [userId]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q),
    );
  }, [customers, search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">고객 목록</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-2">
          <Link href={`/workspaces/${workspaceId}/customers/new`}>
            <Button type="button">신규 등록</Button>
          </Link>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="이름, 전화번호, 주소 검색..."
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredCustomers.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-xl mt-6">
          <p className="text-xl text-gray-500">
            {customers.length === 0
              ? "등록된 고객이 없습니다."
              : "검색 결과가 없습니다."}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              workspaceId={workspaceId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
