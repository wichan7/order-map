import { Button } from "@/components/server/Button";
import { ORDER_STATUS_OPTIONS } from "@/core/constants";
import type { Order } from "@/services/orders/types";

interface InfoWindowProps {
  order: Order;
  className?: string;
  onClickClose?: () => void;
  onClickLink?: () => void;
}

// 정보 항목을 깔끔하게 표시하기 위한 보조 컴포넌트
const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-start py-0.5 border-b border-gray-100 last:border-b-0">
    <span className="font-medium text-gray-500 min-w-[60px] pr-2">{label}</span>
    <span className="text-gray-800 text-right break-words">{value}</span>
  </div>
);

export default function InfoWindow({
  order,
  className,
  onClickClose,
  onClickLink,
}: InfoWindowProps) {
  const statusLabel =
    ORDER_STATUS_OPTIONS.find((option) => option.value === order.status)
      ?.label || "알 수 없음";

  return (
    <div
      className={`max-w-xs bg-white shadow-xl rounded-xl border border-gray-100 text-sm overflow-hidden ${className}`}
    >
      {/* 헤더: 닫기 버튼 */}
      <div className="flex justify-end p-2 border-b border-gray-100">
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

      <div className="p-4 space-y-2">
        {order.phone && <InfoItem label="전화번호" value={order.phone} />}
        {order.address && <InfoItem label="주소" value={order.address} />}
        {order.address_detail && <InfoItem label="상세 주소" value={order.address_detail} />}
        {order.quantity && <InfoItem label="개수" value={order.quantity} />}
        {order.customer_price && <InfoItem label="판매 가격" value={order.customer_price} />}
        {order.created_at && (
          <InfoItem label="생성일" value={order.created_at.toLocaleString()} />
        )}
        {order.updated_at && (
          <InfoItem label="수정일" value={order.updated_at.toLocaleString()} />
        )}
      </div>

      {order.memo && (
        <div className="px-4 pt-2 pb-4 border-t border-gray-100">
          <p className="font-semibold text-gray-700 mb-1">메모</p>
          <div className="text-gray-600 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto whitespace-pre-wrap">
            {order.memo}
          </div>
        </div>
      )}

      {onClickLink && (
        <div className="p-3 border-t border-gray-100">
          <Button
            className="w-full text-base font-semibold"
            onClick={onClickLink}
          >
            주문 상세 보기
          </Button>
        </div>
      )}
    </div>
  );
}
