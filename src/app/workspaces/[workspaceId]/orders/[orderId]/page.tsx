import { redirect } from "next/navigation";
import authService from "@/services/auth/service";
import customerService from "@/services/customers/service";
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

  let customers: Awaited<ReturnType<typeof customerService.get>> = [];
  if (isNew) {
    const user = await authService.getCurrentUser();
    if (!user) {
      redirect("/login");
      return null;
    }
    customers = await customerService.get(user.id);
  }

  return (
    <ClientPage
      order={order}
      isNew={isNew}
      workspaceId={workspaceId}
      customers={customers}
    />
  );
}
