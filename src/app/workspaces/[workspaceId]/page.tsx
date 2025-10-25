import { notFound } from "next/navigation";
import workspaceDao from "@/dao/workspaceDao";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export default async function WorkspacePage({ params }: Props) {
  const { workspaceId } = await params;
  if (!workspaceId) {
    return notFound();
  }
  const workspace = await workspaceDao.selectOneById(workspaceId);
  if (!workspace) {
    return notFound();
  }

  return (
    <main>
      <p>{JSON.stringify(workspace)}</p>
    </main>
  );
}
