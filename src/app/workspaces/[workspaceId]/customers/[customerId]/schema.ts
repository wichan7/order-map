import { z } from "zod";

export type CustomerForm = z.infer<typeof customerFormSchema>;

export const customerFormSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().min(1, "사용자 ID는 필수입니다"),
  name: z.string().min(1, "성함은 필수입니다"),
  phone: z.string().optional(),
  entrance_password: z.string().optional(),
  address: z.string().optional(),
  address_detail: z.string().optional(),
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
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  address_text: z.string().optional(),
});
