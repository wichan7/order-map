import { Button } from "@/components/server/Button";
import { Input } from "@/components/server/Input";
import { goDashboardAction } from "./actions";

export default function Home() {
  return (
    <form
      action={goDashboardAction}
      className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black"
    >
      <div className="flex gap-2">
        <Input name="workspaceNm" placeholder="워크스페이스 이름" />
        <Button>이동</Button>
      </div>
    </form>
  );
}
