import ClientPage from "./ClientPage";
import * as orderDao from "./orders/dao";

export default async function WorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;
  const orders = await orderDao.select(workspaceId);

  return <ClientPage workspaceId={workspaceId} orders={orders} />;
}
