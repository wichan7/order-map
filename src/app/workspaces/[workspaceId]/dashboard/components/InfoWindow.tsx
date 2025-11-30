import type { Order } from "@/services/orders/types";

interface InfoWindowProps {
  order: Order;
  className?: string;
  onClickClose?: () => void;
}

export default function InfoWindow({
  order,
  className,
  onClickClose,
}: InfoWindowProps) {
  return (
    <div
      className={`max-w-xs p-3 bg-white shadow-lg rounded-lg border border-gray-200 text-sm ${className}`}
    >
      <button
        type="button"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        onClick={onClickClose}
      >
        ×
      </button>
      {order.id && (
        <p className="text-gray-800 font-semibold mb-1">주문 ID: {order.id}</p>
      )}
      <p className="text-gray-700 mb-1">
        워크스페이스 ID: {order.workspace_id}
      </p>
      <p className="text-gray-700 mb-1">위도: {order.lat}</p>
      <p className="text-gray-700 mb-1">경도: {order.lng}</p>
      {order.phone && (
        <p className="text-gray-700 mb-1">전화번호: {order.phone}</p>
      )}
      {order.address && (
        <p className="text-gray-700 mb-1">주소: {order.address}</p>
      )}
      {order.memo && <p className="text-gray-700 mb-1">메모: {order.memo}</p>}
      {order.status && (
        <p className="text-gray-700 mb-1">상태: {order.status}</p>
      )}
      {order.created_at && (
        <p className="text-gray-500 mb-1">
          생성일: {order.created_at.toLocaleString()}
        </p>
      )}
      {order.updated_at && (
        <p className="text-gray-500">
          수정일: {order.updated_at.toLocaleString()}
        </p>
      )}
    </div>
  );
}
