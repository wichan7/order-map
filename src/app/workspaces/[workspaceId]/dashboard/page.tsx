import ClientPage from "./ClientPage";

export default async function WorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;

  return <ClientPage workspaceId={workspaceId} />;
}
