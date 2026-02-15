"use client";

import { useActionState } from "react";
import { Button } from "@/components/server/Button";
import { Input } from "@/components/server/Input";
import { type LoginState, loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            로그인
          </h1>
          <form action={formAction} className="flex flex-col gap-4">
            <Input
              name="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              required
            />
            {state?.error && (
              <div className="text-red-500 text-sm">{state.error}</div>
            )}
            <Button type="submit" className="w-full mt-4">
              로그인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
