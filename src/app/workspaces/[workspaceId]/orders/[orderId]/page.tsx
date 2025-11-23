import { Button } from "@/components/server/Button";
import { Input } from "@/components/server/Input";
import * as orderDao from "@/services/orders/dao";
import {
  createOrderAction,
  modifyOrderAction,
  removeOrderAction,
} from "../actions";

export default async function OrdersPage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string; orderId: string }>;
}>) {
  const { workspaceId, orderId } = await params;
  const isNew = orderId === "new";
  const order = !isNew ? await orderDao.selectById(orderId) : undefined;

  return (
    <form className="bg-white px-4 py-4">
      <div className="flex justify-between">
        <span className="text-xl">주문 관리</span>
        <div className="flex gap-2">
          {isNew && (
            <Button className="px-4" formAction={createOrderAction}>
              생성
            </Button>
          )}
          {!isNew && (
            <>
              <Button variant="error" formAction={removeOrderAction}>
                삭제
              </Button>
              <Button formAction={modifyOrderAction}>제출</Button>
            </>
          )}
        </div>
      </div>
      <Input name="id" label="ID" defaultValue={order?.id} />
      <Input name="phone" label="휴대폰" defaultValue={order?.phone} />
      <Input name="memo" label="메모" defaultValue={order?.memo} />
      <Input name="address" label="주소" defaultValue={order?.address} />
      <Input
        name="address_road"
        label="도로명 주소"
        defaultValue={order?.address_road}
      />
      <Input name="lat" label="위도" defaultValue={order?.lat} />
      <Input name="lng" label="경도" defaultValue={order?.lng} />
      <Input name="status" label="상태" defaultValue={order?.status} />
      <Input
        name="created_at"
        label="생성일시"
        defaultValue={order?.created_at}
        readOnly
      />
      <Input
        name="workspace_id"
        defaultValue={order?.workspace_id || workspaceId}
        hidden
      />
    </form>
  );
}
