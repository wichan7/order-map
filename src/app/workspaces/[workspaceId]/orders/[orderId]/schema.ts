import { z } from "zod";
import { ORDER_STATUS } from "@/core/constants";

export type OrderForm = z.infer<typeof orderFormSchema>;

export const orderFormSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().min(1, "워크스페이스 ID는 필수입니다"),
  lat: z
    .number({ message: "위도를 검색해주세요" })
    .min(-90, "유효한 위도 범위가 아닙니다")
    .max(90, "유효한 위도 범위가 아닙니다")
    .optional(),
  lng: z
    .number({ message: "경도를 검색해주세요" })
    .min(-180, "유효한 경도 범위가 아닙니다")
    .max(180, "유효한 경도 범위가 아닙니다")
    .optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  address_detail: z.string().optional(),
  quantity: z.string().optional(),
  customer_price: z.string().optional(),
  customer_name: z.string().optional(),
  entrance_password: z.string().optional(),
  memo: z.string().optional(),
  status: z.enum(Object.values(ORDER_STATUS)).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  address_text: z.string().optional(),
});
