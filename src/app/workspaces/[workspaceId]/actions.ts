"use server";

import authService from "@/services/auth/service";
import workspaceService from "@/services/workspaces/service";

export async function getWorkspaceAction(workspaceId: string) {
  const user = await authService.getCurrentUser();
  if (!user) return null;

  return await workspaceService.getOneById(workspaceId, user.id);
}

export async function updateWorkspaceMemoAction(workspaceId: string, memo: string) {
  await workspaceService.updateMemo(workspaceId, memo);
}
