"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/server/Button";
import Chip from "@/components/server/Chip";
import type { Order } from "@/services/orders/types";
import { renderWithBreaks } from "@/utils/render";
import { getOrdersAction, removeAllOrdersAction } from "./actions";

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
        <Chip
          size="small"
          className={`text-slate-50 font-bold ${
            order.status === "registered" ? "bg-sky-600" : "bg-yellow-500"
          }`}
        >
          {order.status === "registered" ? "대기" : "완료"}
        </Chip>
      </div>

      <div className="text-sm space-y-1 mb-3">
        {order.phone && (
          <p className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-500">전화번호:</span>
            <span>{order.phone}</span>
          </p>
        )}
        {order.delivery_day && (
          <p className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-500">배송 요일:</span>
            <span>{order.delivery_day}</span>
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
  const [isDeleting, setIsDeleting] = useState(false);

  const loadOrders = useCallback(async () => {
    const result = await getOrdersAction(workspaceId);
    setOrders(result);
  }, [workspaceId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleDeleteAll = async () => {
    if (
      !confirm(
        "정말로 모든 주문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await removeAllOrdersAction(workspaceId);
      await loadOrders();
    } catch (error) {
      alert("전체 삭제 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const handleDownloadCsv = () => {
    if (orders.length === 0) return;
    const headers = [
      "주문ID",
      "상태",
      "고객명",
      "전화번호",
      "주소",
      "상세주소",
      "수량",
      "판매가격",
      "공동현관비밀번호",
      "메모",
      "배송요일",
      "생성일시",
      "수정일시",
    ];

    const escapeCell = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const rows = orders.map((order) => [
      order.id || "",
      order.status === "registered" ? "대기" : "완료",
      order.customer_name || "",
      order.phone || "",
      order.address || "",
      order.address_detail || "",
      order.quantity || "",
      order.customer_price || "",
      order.entrance_password || "",
      (order.memo || "").replace(/\n/g, " "),
      order.delivery_day || "",
      order.created_at || "",
      order.updated_at || "",
    ]);

    const csv =
      "\uFEFF" +
      [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = downloadLinkRef.current;
    if (link) {
      link.href = url;
      link.download = `주문목록_${dayjs().format("YYYYMMDD_HHmmss")}.csv`;
      link.click();
    }
    URL.revokeObjectURL(url);
  };

  const sortedAndFilteredOrders = useMemo(() => {
    const result =
      filter === "all"
        ? orders
        : orders.filter((order) => order.status === filter);

    result.sort(
      (a, b) => dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix(),
    );

    return result;
  }, [orders, filter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">주문 목록</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-2">
          <Link href={`/workspaces/${workspaceId}/orders/new`}>
            <Button type="button">신규 등록</Button>
          </Link>
          <Link href={`/workspaces/${workspaceId}/orders/bulk`}>
            <Button type="button" variant="ghost">
              다중 등록
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            onClick={handleDownloadCsv}
            disabled={orders.length === 0}
          >
            다운로드
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleDeleteAll}
            disabled={isDeleting || orders.length === 0}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "삭제 중..." : "전체 삭제"}
          </Button>
          {/** biome-ignore lint/a11y/useAnchorContent: <hidden element for download> */}
          {/** biome-ignore lint/a11y/useValidAnchor: <hidden element for download> */}
          <a ref={downloadLinkRef} className="hidden" />
        </div>
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

      {sortedAndFilteredOrders.length === 0 ? (
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
