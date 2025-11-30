"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import ReactDOMServer from "react-dom/server";
import { COORD_SAEHAN } from "@/core/constants";
import type { COORD } from "@/types/geo";
import type { TMapInstance } from "@/types/tmap";

interface MarkerProps {
  position: COORD;
  content?: ReactNode;
  onClick?: () => void;
}

interface TMapProps {
  center?: COORD;
  zoom?: number;
  markerList?: MarkerProps[];
  style?: CSSProperties;
  className?: string;
  onMapLoaded?: (map: any) => void;
}

export function TMap({
  center = COORD_SAEHAN,
  zoom = 14,
  markerList = [],
  onMapLoaded,
  ...props
}: TMapProps) {
  const [mapInstance, setMapInstance] = useState<TMapInstance | null>(null);
  const mapId = useId();

  // initialize TMap
  useEffect(() => {
    const map = new Tmapv3.Map(mapId, {
      center: new Tmapv3.LatLng(center.lat, center.lng),
      zoom,
    });
    setMapInstance(map);
    onMapLoaded?.(map);

    return () => {
      const mapContainer = document.getElementById(mapId);
      if (mapContainer) {
        mapContainer.innerHTML = "";
        setMapInstance(null);
      }
    };
  }, [mapId, center, zoom, onMapLoaded]);

  // Map-Marker
  useEffect(() => {
    if (!mapInstance) return;

    const markerInstanceList: any[] = [];
    for (const { content, position, onClick } of markerList) {
      const marker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(position.lat, position.lng),
        iconHTML: ReactDOMServer.renderToStaticMarkup(content),
        map: mapInstance,
      });

      marker.on("click", () => onClick?.());
      markerInstanceList.push(marker);
    }

    return () => {
      markerInstanceList.forEach((marker) => {
        marker.off("click");
        marker.setMap(null);
      });
    };
  }, [markerList, mapInstance]);

  return <div id={mapId} {...props} />;
}
