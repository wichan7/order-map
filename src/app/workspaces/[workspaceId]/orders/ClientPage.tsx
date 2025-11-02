"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order } from "@/services/orders/types";
import { getOrdersAction } from "./actions";

interface Props {
  workspaceId: string;
}

export default function ClientPage({ workspaceId }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "registered" | "completed">(
    "all",
  );

  useEffect(() => {
    getOrdersAction(workspaceId).then((result) => setOrders(result));
  }, [workspaceId]);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">주문 목록</h1>

      {/* 필터 버튼 */}
      <div className="flex gap-2 mb-6">
        {["all", "registered", "completed"].map((status) => (
          <button
            type="button"
            key={status}
            onClick={() =>
              setFilter(status as "all" | "registered" | "completed")
            }
            className={`px-4 py-2 rounded ${
              filter === status
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            } transition`}
          >
            {status === "all"
              ? "전체"
              : status === "registered"
                ? "등록"
                : "완료"}
          </button>
        ))}
      </div>

      {/* 주문 리스트 */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">조건에 맞는 주문이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/workspaces/${workspaceId}/orders/${order.id}`}
            >
              <li className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold mb-2">
                  {order.address_road || order.address}
                </h2>
                {order.memo && (
                  <p className="text-gray-600">메모: {order.memo}</p>
                )}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
