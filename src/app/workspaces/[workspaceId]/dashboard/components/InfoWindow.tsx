import type { Order } from "@/services/orders/types";
import InfoWindowContainer from "./InfoWindowContainer";

interface InfoWindowProps {
  orderList: Order[];
  className?: string;
  onClickClose?: () => void;
  onClickLink?: (order: Order) => void;
  onStatusChange?: (order: Order) => void;
}

export default function InfoWindow({
  orderList,
  className,
  onClickClose,
  onClickLink,
  onStatusChange,
}: InfoWindowProps) {
  return (
    <InfoWindowContainer
      orderList={orderList}
      className={className}
      onClickClose={onClickClose}
      onClickLink={onClickLink}
      onStatusChange={onStatusChange}
    />
  );
}
