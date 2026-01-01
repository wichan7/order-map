import type { Order } from "@/services/orders/types";

interface InfoWindowContentProps {
  order: Order;
}

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-start py-0.5 border-b border-gray-100 last:border-b-0">
    <span className="font-medium text-gray-500 min-w-[60px] pr-2">{label}</span>
    <span className="text-gray-800 text-right break-words">{value}</span>
  </div>
);

export default function InfoWindowContent({ order }: InfoWindowContentProps) {
  return (
    <>
      <div className="p-4 space-y-2">
        {order.customer_name && (
          <InfoItem label="이름" value={order.customer_name} />
        )}
        {order.phone && <InfoItem label="전화번호" value={order.phone} />}
        {order.address && <InfoItem label="주소" value={order.address} />}
        {order.address_detail && (
          <InfoItem label="상세 주소" value={order.address_detail} />
        )}
        {order.entrance_password && (
          <InfoItem label="현관 출입 번호" value={order.entrance_password} />
        )}
        {order.quantity && <InfoItem label="개수" value={order.quantity} />}
        {order.customer_price && (
          <InfoItem label="판매 가격" value={order.customer_price} />
        )}
      </div>

      {order.memo && (
        <div className="px-4 pt-2 pb-4 border-t border-gray-100">
          <div className="text-gray-600 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto whitespace-pre-wrap">
            {order.memo}
          </div>
        </div>
      )}
    </>
  );
}
