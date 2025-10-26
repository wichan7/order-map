"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { getAddressByLatLng } from "../util";
import * as orderAction from "./orders/actions";
import type { Order } from "./orders/types";

interface Marker extends Order {}

interface Props {
  workspaceId: string;
  orders: Order[];
}

export default function ClientPage({ workspaceId, orders }: Props) {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [newMarker, setNewMarker] = useState<Marker | null>(null);

  useEffect(() => {
    setMarkers(orders.map((order) => ({ ...order, collapsed: true })));
  }, [orders]);

  const handleMapClick = async (
    _: kakao.maps.Map,
    { latLng }: kakao.maps.event.MouseEvent,
  ) => {
    const [lat, lng] = [latLng.getLat(), latLng.getLng()];
    const address = await getAddressByLatLng(lat, lng);

    setSelectedMarker(null);
    setNewMarker({
      lat,
      lng,
      workspaceId,
      address: address?.address?.address_name,
      address_road: address?.road_address?.address_name,
    });
  };

  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
    setNewMarker(null);
  };

  const handleSubmit = () => {
    if (newMarker) {
      orderAction.create(newMarker);
      setNewMarker(null);
    }
  };

  const handleCancel = () => {
    setNewMarker(null);
  };

  return (
    <div className="flex h-full">
      <Map
        className="flex-4"
        center={{ lat: 37.6051650256136, lng: 127.10122162040625 }}
        level={4}
        onClick={handleMapClick}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`${marker.id}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
        {selectedMarker && (
          <MapMarker
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          >
            <div className="bg-white p-5 text-sm wrap-break-word">
              {selectedMarker.address_road || selectedMarker.address}
            </div>
          </MapMarker>
        )}
        {newMarker && (
          <MapMarker position={{ lat: newMarker.lat, lng: newMarker.lng }}>
            <div className="bg-white p-5 text-sm wrap-break-word">
              {newMarker.address || "결과 없음"}
              {newMarker.address && (
                <form onSubmit={handleSubmit} className="flex gap-6">
                  <button type="button">적용</button>
                  <button type="button" onClick={handleCancel}>
                    취소
                  </button>
                </form>
              )}
            </div>
          </MapMarker>
        )}
      </Map>
      <aside className="flex-1 overflow-y-scroll">
        {orders.map(({ address, lat, lng }) => (
          <div className="border-b border-solid min-h-40" key={`${lat}-${lng}`}>
            {address}
          </div>
        ))}
      </aside>
    </div>
  );
}
