"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TMap } from "@/components/client/TMap";
import Chip from "@/components/server/Chip";
import type { Order } from "@/services/orders/types";
import type { TMapInstance } from "@/types/tmap";
import { getOrdersAction, modifyOrderAction } from "../orders/actions";
import InfoWindow from "./components/InfoWindow";
import OrderStats from "./components/OrderStats";

interface Props {
  workspaceId: string;
}

export default function ClientPage({ workspaceId }: Props) {
  const [map, setMap] = useState<TMapInstance | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
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

  const handleClickChip = ({ lat, lng }: Order) => {
    map.setCenter(new Tmapv3.LatLng(lat, lng));
    map.setZoom(16);
  };

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 items-center h-10 border-b border-slate-200">
        <OrderStats
          total={orders.length}
          completed={completedCount}
          registered={registeredCount}
        />
        <aside className="flex-1 flex gap-2 overflow-x-auto h-full items-center">
          {orders
            .sort(
              (a, b) =>
                (a.status === "registered" ? 0 : 1) -
                (b.status === "registered" ? 0 : 1),
            )
            .map((order) => (
              <button
                type="button"
                className="flex-shrink-0"
                key={order.id}
                onClick={() => handleClickChip(order)}
              >
                <Chip
                  className={clsx(
                    "text-slate-50 font-bold",
                    order.status === "registered" && "bg-sky-600",
                    order.status === "completed" && "bg-yellow-500",
                  )}
                >
                  {order.address}
                </Chip>
              </button>
            ))}
        </aside>
      </div>
      <TMap
        className="flex-1"
        markerList={Object.values(groupedOrders).map((orderGroup) => {
          const firstOrder = orderGroup[0];
          const hasMultiple = orderGroup.length > 1;
          const hasRegistered = orderGroup.some(
            (o) => o.status === "registered",
          );
          const statusColor = hasRegistered ? "bg-sky-600" : "bg-yellow-500";
          const statusText = hasRegistered ? "대기" : "완료";
          const borderColor = hasRegistered
            ? "border-t-sky-600"
            : "border-t-yellow-500";

          return {
            content: (
              <div className="relative">
                <Chip
                  size="small"
                  className={`${statusColor} text-slate-50 font-bold`}
                >
                  {hasMultiple ? `${orderGroup.length}건` : statusText}
                </Chip>
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] ${borderColor}`}
                  style={{
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
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
