"use server";

import { redirect } from "next/navigation";
import * as workspaceDao from "@/features/workspaces/dao";

export async function goDashboardAction(formData: FormData) {
  const nm = (formData.get("workspaceNm") as string)?.trim();
  if (!nm) return;

  const id = await (async () => {
    const workspace = await workspaceDao.getOneByNm(nm);
    if (workspace) return workspace.id;

    const newWorkspace = await workspaceDao.create({ nm });
    return newWorkspace?.id;
  })();
  if (!id) return;

  redirect(`/workspaces/${id}`);
}
