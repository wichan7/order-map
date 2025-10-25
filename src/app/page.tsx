import { redirect } from "next/navigation";
import workspaceDao from "@/dao/workspaceDao";

async function handleAction(formData: FormData) {
  "use server";

  const nm = (formData.get("workspaceNm") as string)?.trim();
  if (!nm) return;

  const id = await (async () => {
    const workspace = await workspaceDao.selectOneByNm(nm);
    if (workspace) return workspace.id;

    const newWorkspace = await workspaceDao.insert({ nm });
    return newWorkspace?.id;
  })();
  if (!id) return;

  redirect(`/workspaces/${id}`);
}

export default function Home() {
  return (
    <form
      action={handleAction}
      className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black"
    >
      <h1>Enter Your Workspace</h1>
      <div className="flex gap-2">
        <input
          name="workspaceNm"
          placeholder="워크스페이스 이름"
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          GO
        </button>
      </div>
    </form>
  );
}
