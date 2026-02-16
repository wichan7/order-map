import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/server/Button";
import { Input } from "@/components/server/Input";
import authService from "@/services/auth/service";
import workspaceService from "@/services/workspaces/service";
import { goDashboardAction } from "./actions";

export default async function Home() {
  const user = await authService.getCurrentUser();
  if (!user) {
    redirect("/login");
    return null;
  }

  const workspaces = await workspaceService.getAll(user.id);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-8 p-8">
      <form action={goDashboardAction} className="flex gap-2">
        <Input name="workspaceNm" placeholder="워크스페이스 이름" />
        <Button className="flex-shrink-0">이동</Button>
      </form>

      {workspaces.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            워크스페이스 목록
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800 max-h-96 overflow-y-auto">
              {workspaces.map((workspace) => (
                <li key={workspace.id}>
                  <Link
                    href={`/workspaces/${workspace.id}/dashboard`}
                    className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {workspace.nm}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(workspace.created_at).toLocaleDateString(
                          "ko-KR",
                        )}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
