"use client";

import { useState } from "react";
import { Button } from "@/components/server/Button";
import { Select } from "@/components/server/Select";
import type { Order } from "@/services/orders/types";
import InfoWindowContent from "./InfoWindowContent";

interface InfoWindowContainerProps {
  orderList: Order[];
  className?: string;
  onClickClose?: () => void;
  onClickLink?: (order: Order) => void;
  onStatusChange?: (order: Order) => void;
}

export default function InfoWindowContainer({
  orderList,
  className,
  onClickClose,
  onClickLink,
  onStatusChange,
}: InfoWindowContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (orderList.length === 0) {
    return null;
  }

  const currentOrder = orderList[currentIndex];
  const hasMultipleOrders = orderList.length > 1;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : orderList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < orderList.length - 1 ? prev + 1 : 0));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "registered" | "completed";
    const updatedOrder: Order = {
      ...currentOrder,
      status: newStatus,
    };
    onStatusChange?.(updatedOrder);
  };

  const statusOptions = [
    { value: "registered", label: "대기" },
    { value: "completed", label: "완료" },
  ];

  return (
    <div
      className={`max-w-xs bg-white shadow-xl rounded-xl border border-gray-100 text-sm overflow-hidden ${className}`}
    >
      <div className="flex justify-between items-center p-2 border-b border-gray-100">
        {hasMultipleOrders && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              onClick={handlePrevious}
              aria-label="이전"
            >
              {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-xs text-gray-500 min-w-[60px] text-center">
              {currentIndex + 1} / {orderList.length}
            </span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              onClick={handleNext}
              aria-label="다음"
            >
              {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1" />
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClickClose}
          aria-label="닫기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Close Icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <InfoWindowContent order={currentOrder} />

      {onStatusChange && (
        <div className="px-4 py-3 border-t border-gray-100">
          <Select
            value={currentOrder.status || "registered"}
            options={statusOptions}
            onChange={handleStatusChange}
            className="w-full"
          />
        </div>
      )}

      {onClickLink && (
        <div className="p-3 border-t border-gray-100">
          <Button
            className="w-full text-base font-semibold"
            onClick={() => onClickLink(currentOrder)}
          >
            주문 상세 보기
          </Button>
        </div>
      )}
    </div>
  );
}
