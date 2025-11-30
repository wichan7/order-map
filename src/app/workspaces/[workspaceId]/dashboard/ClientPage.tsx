"use client";

import { useEffect, useState } from "react";
import { TMap } from "@/components/client/TMap";
import Chip from "@/components/server/Chip";
import type { Order } from "@/services/orders/types";
import type { TMapInstance } from "@/types/tmap";
import { getOrdersAction } from "../orders/actions";
import InfoWindow from "./components/InfoWindow";

interface Props {
  workspaceId: string;
}

export default function ClientPage({ workspaceId }: Props) {
  const [map, setMap] = useState<TMapInstance | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrdersAction(workspaceId).then(setOrders);
  }, [workspaceId]);

  const handleClickChip = ({ lat, lng }: Order) => {
    map.setCenter(new Tmapv3.LatLng(lat, lng));
    map.setZoom(16);
  };

  return (
    <div className="flex flex-col h-full">
      <aside className="h-10 flex gap-2 always-scrollbar-x">
        {orders.map((order) => (
          <button
            type="button"
            className="flex-shrink-0"
            key={order.id}
            onClick={() => handleClickChip(order)}
          >
            <Chip>{order.address}</Chip>
          </button>
        ))}
      </aside>
      <TMap
        className="flex-1"
        markerList={orders.map((order) => ({
          content: (
            <Chip
              className={`${order.status === "registered" ? "bg-red-500" : "bg-lime-500"} text-slate-50 font-bold`}
            >
              {order.status === "registered" ? "등록" : "완료"}
            </Chip>
          ),
          onClick: () => setSelectedOrder(order),
          position: { lat: order.lat, lng: order.lng },
        }))}
        onMapLoaded={setMap}
      />
      {selectedOrder && (
        <InfoWindow
          order={selectedOrder}
          className="absolute bottom-10 right-10"
          onClickClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
