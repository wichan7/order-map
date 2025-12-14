import ClientPage from "./ClientPage";

export default async function OrdersBulkPage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;

  return <ClientPage workspaceId={workspaceId} />;
}
