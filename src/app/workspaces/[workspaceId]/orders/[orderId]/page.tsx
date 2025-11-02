export default async function OrdersPage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string; orderId: string }>;
}>) {
  const { workspaceId, orderId } = await params;

  return (
    <div>
      {workspaceId} {orderId}
    </div>
  );
}
