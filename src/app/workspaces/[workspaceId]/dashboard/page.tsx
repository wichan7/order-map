import * as orderDao from "../../../../features/orders/dao";
import ClientPage from "./ClientPage";

export default async function WorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;
  const orders = await orderDao.select(workspaceId);

  return <ClientPage workspaceId={workspaceId} orders={orders} />;
}
