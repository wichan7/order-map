// app/page.tsx
import { redirect } from "next/navigation";

async function handleAction(formData: FormData) {
  "use server";
  const workspaceId = (formData.get("workspaceId") as string)?.trim();
  if (!workspaceId) return;
  redirect(`/workspaces/${encodeURIComponent(workspaceId)}`);
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
          name="workspaceId"
          placeholder="type workspace id"
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          GO
        </button>
      </div>
    </form>
  );
}
