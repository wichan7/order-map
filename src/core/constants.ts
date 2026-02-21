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

export const DELIVERY_DAY_OPTIONS: { label: string; value: string }[] = [
  { label: "선택 안함", value: "" },
  { label: "월요일", value: "월요일" },
  { label: "화요일", value: "화요일" },
  { label: "수요일", value: "수요일" },
  { label: "목요일", value: "목요일" },
  { label: "금요일", value: "금요일" },
  { label: "토요일", value: "토요일" },
  { label: "일요일", value: "일요일" },
];
