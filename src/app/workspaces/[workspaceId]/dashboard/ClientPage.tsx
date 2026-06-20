"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TMap } from "@/components/client/TMap";
import type { Order } from "@/services/orders/types";
import type { TMapInstance } from "@/types/tmap";
import { debounce } from "@/utils/debounce";
import { extractNumber } from "@/utils/render";
import { updateWorkspaceMemoAction } from "../actions";
import { getOrdersAction, modifyOrderAction } from "../orders/actions";
import InfoWindow from "./components/InfoWindow";
import OrderStats from "./components/OrderStats";

interface Props {
  workspaceId: string;
  initialMemo: string;
}

const COMPLETED_MARKER_COLOR = "#eab308";
const UNKNOWN_DELIVERY_DAY_COLOR = "#64748b";

const DELIVERY_DAY_COLORS = [
  {
    label: "월",
    color: "#0072b2",
    textColor: "#ffffff",
    aliases: ["월", "월요일"],
  },
  {
    label: "화",
    color: "#e69f00",
    textColor: "#111827",
    aliases: ["화", "화요일"],
  },
  {
    label: "수",
    color: "#5b2a86",
    textColor: "#ffffff",
    aliases: ["수", "수요일"],
  },
  {
    label: "목",
    color: "#56b4e9",
    textColor: "#111827",
    aliases: ["목", "목요일"],
  },
  {
    label: "금",
    color: "#d55e00",
    textColor: "#ffffff",
    aliases: ["금", "금요일"],
  },
  {
    label: "토",
    color: "#000000",
    textColor: "#ffffff",
    aliases: ["토", "토요일"],
  },
  {
    label: "일",
    color: "#f0e442",
    textColor: "#111827",
    aliases: ["일", "일요일"],
  },
];

const getDeliveryDayStyle = (deliveryDay?: string) => {
  const normalizedDeliveryDay = deliveryDay?.trim();

  if (!normalizedDeliveryDay) {
    return { color: UNKNOWN_DELIVERY_DAY_COLOR, textColor: "#ffffff" };
  }

  return (
    DELIVERY_DAY_COLORS.find((day) =>
      day.aliases.some((alias) => normalizedDeliveryDay.includes(alias)),
    ) || { color: UNKNOWN_DELIVERY_DAY_COLOR, textColor: "#ffffff" }
  );
};

export default function ClientPage({ workspaceId, initialMemo }: Props) {
  const [_, setMap] = useState<TMapInstance | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [memo, setMemo] = useState(initialMemo);

  const saveMemo = useMemo(
    () =>
      debounce(
        (value: string) => updateWorkspaceMemoAction(workspaceId, value),
        800,
      ),
    [workspaceId],
  );

  const handleMemoChange = (value: string) => {
    setMemo(value);
    saveMemo(value);
  };
  const router = useRouter();

  useEffect(() => {
    getOrdersAction(workspaceId).then(setOrders);
  }, [workspaceId]);

  const groupedOrders = orders.reduce(
    (acc, order) => {
      const key = `${order.lat},${order.lng}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    },
    {} as Record<string, Order[]>,
  );
  const handleStatusChange = async (updatedOrder: Order) => {
    await modifyOrderAction(updatedOrder);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );

    setSelectedOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
  };

  const completedCount = orders.filter((o) => o.status === "completed").length;
  const registeredCount = orders.filter(
    (o) => o.status === "registered",
  ).length;

  const totalQuantity = orders.reduce(
    (sum, o) => sum + extractNumber(o.quantity),
    0,
  );
  const completedQuantity = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + extractNumber(o.quantity), 0);
  const registeredQuantity = orders
    .filter((o) => o.status === "registered")
    .reduce((sum, o) => sum + extractNumber(o.quantity), 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 items-center h-10 border-b border-slate-200">
        <OrderStats
          total={orders.length}
          completed={completedCount}
          registered={registeredCount}
          totalQuantity={totalQuantity}
          completedQuantity={completedQuantity}
          registeredQuantity={registeredQuantity}
        />
        <div className="ml-auto flex items-center gap-2 px-4 border-l border-slate-200 h-full">
          <input
            className="text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-300 w-64"
            placeholder="워크스페이스 메모를 입력하세요"
            value={memo}
            onChange={(e) => handleMemoChange(e.target.value)}
          />
        </div>
      </div>
      <TMap
        className="flex-1"
        markerList={Object.values(groupedOrders).map((orderGroup) => {
          const firstOrder = orderGroup[0];
          const hasMultiple = orderGroup.length > 1;
          const firstRegisteredOrder = orderGroup.find(
            (o) => o.status === "registered",
          );
          const hasRegistered = Boolean(firstRegisteredOrder);
          const markerStyle = hasRegistered
            ? getDeliveryDayStyle(firstRegisteredOrder?.delivery_day)
            : { color: COMPLETED_MARKER_COLOR, textColor: "#111827" };
          const statusText = hasRegistered ? "대기" : "완료";

          return {
            content: (
              <div className="relative">
                <div
                  className="truncate px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: markerStyle.color,
                    color: markerStyle.textColor,
                  }}
                >
                  {hasMultiple ? `${orderGroup.length}건` : statusText}
                </div>
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px]"
                  style={{
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderTopColor: markerStyle.color,
                  }}
                />
              </div>
            ),
            onClick: () => setSelectedOrders(orderGroup),
            position: { lat: firstOrder.lat, lng: firstOrder.lng },
          };
        })}
        onMapLoaded={setMap}
      />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 border-t border-slate-200 bg-white text-xs text-slate-600">
        <span className="font-semibold text-slate-700">미완료 요일 색상</span>
        {DELIVERY_DAY_COLORS.map((day) => (
          <span key={day.label} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: day.color }}
            />
            {day.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: UNKNOWN_DELIVERY_DAY_COLOR }}
          />
          미지정
        </span>
      </div>
      {selectedOrders.length > 0 && (
        <InfoWindow
          orderList={selectedOrders}
          className="absolute bottom-10 right-10"
          onClickClose={() => setSelectedOrders([])}
          onClickLink={(order) => router.push(`orders/${order.id}`)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
