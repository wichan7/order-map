"use server";

import { redirect } from "next/navigation";
import workspaceService from "@/services/workspaces/service";

export async function goDashboardAction(formData: FormData) {
  const nm = (formData.get("workspaceNm") as string)?.trim();
  if (!nm) return;

  const id = await (async () => {
    const workspace = await workspaceService.getOneByNm(nm);
    if (workspace) return workspace.id;

    const newWorkspace = await workspaceService.create({ nm });
    return newWorkspace?.id;
  })();
  if (!id) return;

  redirect(`/workspaces/${id}/dashboard`);
}
