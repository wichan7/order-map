import type { COORD } from "@/types/geo";

export const COORD_SAEHAN: COORD = {
  lat: 37.6051650256136,
  lng: 127.10122162040625,
};

export const ORDER_STATUS = {
  REGISTERED: "registered",
  COMPLETED: "completed",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: "대기", value: ORDER_STATUS.REGISTERED },
  { label: "완료", value: ORDER_STATUS.COMPLETED },
];
