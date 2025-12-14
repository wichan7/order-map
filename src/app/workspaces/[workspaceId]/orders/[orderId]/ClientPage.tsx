"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Textarea } from "@/components/client/Textarea";
import { TMap } from "@/components/client/TMap";
import { Button } from "@/components/server/Button";
import { Input } from "@/components/server/Input";
import { Select } from "@/components/server/Select";
import { ORDER_STATUS_OPTIONS } from "@/core/constants";
import type { Order } from "@/services/orders/types";
import tmapService from "@/services/tmap/service";
import {
  createOrderAction,
  modifyOrderAction,
  removeOrderAction,
} from "../actions";
import { type OrderForm, orderFormSchema } from "./schema";

interface Props {
  workspaceId: string;
  isNew: boolean;
  order?: Order;
}

export default function ClientPage({ isNew, order, workspaceId }: Props) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      ...order,
      workspace_id: workspaceId,
    },
  });

  const address_text = useWatch({ control, name: "address_text" });
  const lat = useWatch({ control, name: "lat" });
  const lng = useWatch({ control, name: "lng" });
  const router = useRouter();

  const MemoizedMap = useMemo(() => {
    if (!lat || !lng) return null;
    return (
      <div className="rounded-lg overflow-hidden border border-gray-200 mt-2">
        <TMap
          center={{ lat, lng }}
          className="h-80 w-full"
          markerList={[{ position: { lat, lng } }]}
        />
      </div>
    );
  }, [lat, lng]);

  const onSubmit = handleSubmit(async (formValue) => {
    isNew
      ? await createOrderAction(formValue)
      : await modifyOrderAction(formValue);
    toast.success(`${isNew ? "등록" : "수정"}에 성공했습니다.`);
    router.back();
  });

  const onClickRemove = () => {
    removeOrderAction(order?.id);
    toast.success("삭제에 성공했습니다.");
    router.back();
  };

  const onClickSearch = async () => {
    if (!address_text) {
      setError("address_text", { message: "주소를 입력해주세요" });
      return;
    }

    try {
      const result = await tmapService.findAddressByText(address_text);

      if (Number(result.count) <= 0 || !result.coordinate) {
        throw new Error("검색 결과 없음");
      }

      const address = result.coordinate[0];

      clearErrors("address_text");
      setValue("address", address_text, { shouldValidate: true });
      setValue("lat", Number(address.lat || address.newLat), {
        shouldValidate: true,
      });
      setValue("lng", Number(address.lon || address.newLon), {
        shouldValidate: true,
      });
    } catch (_error) {
      setError("address_text", { message: "검색 결과 없음" });
      setValue("address", "");
      setValue("lat", undefined);
      setValue("lng", undefined);
    }
  };

  return (
    <form
      className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-2xl space-y-8"
      onSubmit={onSubmit}
    >
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {isNew ? "신규 주문 등록" : "주문 상세"}
        </h1>
        <div className="flex gap-3">
          {!isNew && (
            <Button variant="error" type="button" onClick={onClickRemove}>
              삭제
            </Button>
          )}
          <Button disabled={!isValid || isSubmitting}>
            {isNew ? "등록" : "수정"}
          </Button>
        </div>
      </div>

      <section className="space-y-6">
        {!isNew && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="주문 ID"
              {...register("id")}
              disabled
              error={errors.id?.message}
            />
            <Select
              label="주문 상태"
              options={ORDER_STATUS_OPTIONS}
              {...register("status")}
              error={errors.status?.message}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="휴대폰 번호"
            placeholder="01012345678"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <Textarea
            label="메모"
            placeholder="고객 요청 사항, 특이사항 등"
            {...register("memo")}
            error={errors.memo?.message}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
          위치
        </h2>

        <div>
          <Input
            label="배송지 주소 검색"
            {...register("address_text")}
            placeholder="서울특별시 용마산로 616"
            className="w-full"
            error={errors.address_text?.message}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onClickSearch();
              }
            }}
          />
          <Button type="button" onClick={onClickSearch}>
            검색
          </Button>
        </div>

        <Input
          label="확정 주소"
          {...register("address")}
          disabled
          error={errors.address?.message}
          className="w-full"
        />

        {MemoizedMap || (
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 border border-dashed border-gray-300">
            주소 검색 후 지도에 위치가 표시됩니다.
          </div>
        )}
      </section>

      {!isNew && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            기타
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="생성 일시"
              type="datetime-local"
              {...register("created_at")}
              disabled
              error={errors.created_at?.message}
            />
            <Input
              label="수정 일시"
              type="datetime-local"
              {...register("updated_at")}
              disabled
              error={errors.updated_at?.message}
            />
          </div>
        </section>
      )}

      <Input
        label="워크스페이스ID"
        {...register("workspace_id")}
        hidden
        error={errors.workspace_id?.message}
      />
      <Input
        label="위도"
        {...register("lat", { valueAsNumber: true })}
        hidden
        error={errors.lat?.message}
      />
      <Input
        label="경도"
        {...register("lng", { valueAsNumber: true })}
        hidden
        error={errors.lng?.message}
      />
    </form>
  );
}
