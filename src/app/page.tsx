import { goDashboardAction } from "./actions";

export default function Home() {
  return (
    <form
      action={goDashboardAction}
      className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black"
    >
      <div className="flex gap-2">
        <input
          name="workspaceNm"
          placeholder="워크스페이스 이름"
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          이동
        </button>
      </div>
    </form>
  );
}
