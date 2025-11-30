import orderService from "@/services/orders/service";
import ClientPage from "./ClientPage";

export default async function OrdersPage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string; orderId: string }>;
}>) {
  const { workspaceId, orderId } = await params;
  const isNew = orderId === "new";
  const order = !isNew ? await orderService.getOneById(orderId) : undefined;

  return <ClientPage order={order} isNew={isNew} workspaceId={workspaceId} />;
}
