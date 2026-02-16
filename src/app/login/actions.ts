"use server";

import { redirect } from "next/navigation";
import authService from "@/services/auth/service";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "비밀번호를 입력해주세요." };
  }
  const user = await authService.getSingleUser();

  if (password !== user.password) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const session = await authService.login(user.id);
  if (!session) {
    return { error: "세션 생성에 실패했습니다." };
  }

  redirect("/");
}
