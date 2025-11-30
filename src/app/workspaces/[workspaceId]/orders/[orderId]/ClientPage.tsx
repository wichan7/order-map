"use client";

import { useForm, useWatch } from "react-hook-form";
import { TMap } from "@/components/client/TMap";
import { Button } from "@/components/server/Button";
import { Input } from "@/components/server/Input";
import type { Order } from "@/services/orders/types";
import tmapService from "@/services/tmap/service";
import {
  createOrderAction,
  modifyOrderAction,
  removeOrderAction,
} from "../actions";

interface Props {
  workspaceId: string;
  isNew: boolean;
  order?: Order;
}

type FormType = Order & { address_text: string };

export default function ClientPage({ isNew, order, workspaceId }: Props) {
  const { control, register, handleSubmit, setValue } = useForm<FormType>({
    defaultValues: {
      ...order,
      workspace_id: order?.workspace_id ?? workspaceId,
    },
  });
  const address_text = useWatch({ control, name: "address_text" });
  const lat = useWatch({ control, name: "lat" });
  const lng = useWatch({ control, name: "lng" });

  const onSubmit = handleSubmit(async (formValue) => {
    isNew ? createOrderAction(formValue) : modifyOrderAction(formValue);
  });
  const onClickRemove = () => {
    removeOrderAction(order?.id);
  };
  const onClickSearch = async () => {
    const result = await tmapService.findAddressByText(address_text);
    if (!result || Number(result.totalCount) <= 0) {
      return window.alert("결과 없음");
    }
    const address = result.coordinate[0];
    setValue("address", address_text);
    setValue("lat", Number(address.lat || address.newLat));
    setValue("lng", Number(address.lon || address.newLon));
  };

  return (
    <form
      className="bg-white px-4 py-4 flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      <div className="flex justify-between">
        <span className="text-xl">주문 관리</span>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="error" type="button" onClick={onClickRemove}>
              삭제
            </Button>
          )}
          <Button className="px-4">{isNew ? "생성" : "수정"}</Button>
        </div>
      </div>
      <Input label="ID" {...register("id")} disabled hidden={isNew} />
      <Input label="휴대폰" {...register("phone")} />
      <Input label="메모" {...register("memo")} />
      <div>
        <Input label="주소 입력" {...register("address_text")} />
        <Button type="button" onClick={onClickSearch}>
          검색
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input label="주소" {...register("address")} disabled />
          </div>
          <Input label="위도" {...register("lat")} disabled />
          <Input label="경도" {...register("lng")} disabled />
        </div>
        {lat && lng && (
          <TMap
            center={{ lat, lng }}
            className="h-50"
            markerList={[{ position: { lat, lng } }]}
          />
        )}
      </div>
      <Input label="상태" {...register("status")} hidden={isNew} />
      <Input
        label="생성일시"
        {...register("created_at")}
        hidden={isNew}
        disabled
      />
      <Input label="워크스페이스ID" {...register("workspace_id")} hidden />
    </form>
  );
}
