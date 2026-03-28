import { getWorkspaceAction } from "../actions";
import ClientPage from "./ClientPage";

export default async function WorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceAction(workspaceId);

  return (
    <ClientPage workspaceId={workspaceId} initialMemo={workspace?.memo ?? ""} />
  );
}
