"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/services/orders/types";
import { renderWithBreaks } from "@/utils/render";
import { getOrdersAction } from "./actions";

interface Props {
  workspaceId: string;
}

const OrderCard = ({
  order,
  workspaceId,
}: {
  order: Order;
  workspaceId: string;
}) => (
  <Link
    href={`/workspaces/${workspaceId}/orders/${order.id}`}
    className="block"
  >
    <li className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group cursor-pointer">
      <div className="flex justify-between items-start mb-3 border-b pb-2">
        <h2 className="text-lg font-bold text-blue-600 group-hover:text-blue-700 truncate mr-4">
          {order.address || "주소 정보 없음"}
        </h2>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
            order.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status === "completed" ? "완료" : "대기"}
        </span>
      </div>

      <div className="text-sm space-y-1 mb-3">
        {order.phone && (
          <p className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-500">전화번호:</span>
            <span>{order.phone}</span>
          </p>
        )}
        <p className="flex justify-between text-gray-500">
          <span className="font-medium">수정 일시:</span>
          <span>{order.updated_at}</span>
        </p>
      </div>
      {order.memo && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1">메모</p>
          <p className="text-sm text-gray-600 line-clamp-2 max-h-10 overflow-hidden text-ellipsis">
            {renderWithBreaks(order.memo)}
          </p>
        </div>
      )}
    </li>
  </Link>
);

export default function ClientPage({ workspaceId }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "registered" | "completed">(
    "all",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOrdersAction(workspaceId)
      .then((result) => setOrders(result))
      .finally(() => setLoading(false));
  }, [workspaceId]);

  const sortedAndFilteredOrders = useMemo(() => {
    const result =
      filter === "all"
        ? orders
        : orders.filter((order) => order.status === filter);

    result.sort((a, b) => {
      const dateA = dayjs(a.updated_at).unix();
      const dateB = dayjs(b.updated_at).unix();
      return dateB - dateA;
    });

    return result;
  }, [orders, filter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">주문 목록</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Link
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition w-full sm:w-auto text-center"
          href={`/workspaces/${workspaceId}/orders/new`}
        >
          신규 주문 등록
        </Link>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {["all", "registered", "completed"].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilter(status as "all" | "registered" | "completed")
              }
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition duration-200 ${
                filter === status
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "all"
                ? "전체"
                : status === "registered"
                  ? "대기"
                  : "완료"}
            </button>
          ))}
        </div>
      </div>

      {/* 로딩 상태 표시 */}
      {loading && (
        <p className="text-lg text-blue-500 animate-pulse mt-10">
          주문 목록을 불러오는 중입니다...
        </p>
      )}

      {/* 주문 리스트 */}
      {!loading && sortedAndFilteredOrders.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-xl mt-6">
          <p className="text-xl text-gray-500">조건에 맞는 주문이 없습니다.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} workspaceId={workspaceId} />
          ))}
        </ul>
      )}
    </div>
  );
}
