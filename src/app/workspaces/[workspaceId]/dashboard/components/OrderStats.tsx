interface Props {
  total: number;
  completed: number;
  registered: number;
  totalQuantity: number;
  completedQuantity: number;
  registeredQuantity: number;
}

export default function OrderStats({
  total,
  completed,
  registered,
  totalQuantity,
  completedQuantity,
  registeredQuantity,
}: Props) {
  return (
    <div className="flex items-center gap-4 px-3 text-sm font-medium text-slate-600 bg-white shrink-0">
      <span>
        전체{" "}
        <span className="font-bold text-slate-800">{total}건</span>
        {" "}
        <span className="font-bold text-slate-800">{totalQuantity}개</span>
      </span>
      <span className="text-slate-300">|</span>
      <span>
        대기{" "}
        <span className="font-bold text-sky-600">{registered}건</span>
        {" "}
        <span className="font-bold text-sky-600">{registeredQuantity}개</span>
      </span>
      <span className="text-slate-300">|</span>
      <span>
        완료{" "}
        <span className="font-bold text-yellow-500">{completed}건</span>
        {" "}
        <span className="font-bold text-yellow-500">{completedQuantity}개</span>
      </span>
    </div>
  );
}
