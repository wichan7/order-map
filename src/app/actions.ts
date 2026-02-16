"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import authService from "@/services/auth/service";
import workspaceService from "@/services/workspaces/service";

export async function goDashboardAction(formData: FormData) {
  const user = await authService.getCurrentUser();
  if (!user) {
    redirect("/login");
    return;
  }

  const nm = (formData.get("workspaceNm") as string)?.trim();
  if (!nm) return;

  const id = await (async () => {
    const workspace = await workspaceService.getOneByNm(nm, user.id);
    if (workspace) return workspace.id;

    const newWorkspace = await workspaceService.create({ nm, user_id: user.id });
    if (newWorkspace) {
      revalidatePath("/");
    }
    return newWorkspace?.id;
  })();
  if (!id) return;

  redirect(`/workspaces/${id}/dashboard`);
}
