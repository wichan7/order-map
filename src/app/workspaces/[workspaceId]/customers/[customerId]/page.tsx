import { redirect } from "next/navigation";
import authService from "@/services/auth/service";
import customerService from "@/services/customers/service";
import ClientPage from "./ClientPage";

export default async function CustomerDetailPage({
  params,
}: Readonly<{
  params: Promise<{ customerId: string }>;
}>) {
  const { customerId } = await params;
  const user = await authService.getCurrentUser();
  if (!user) {
    redirect("/login");
    return null;
  }

  const isNew = customerId === "new";
  const customer = !isNew
    ? await customerService.getOneById(customerId)
    : undefined;

  return <ClientPage customer={customer} isNew={isNew} userId={user.id} />;
}
