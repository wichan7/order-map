import { redirect } from "next/navigation";
import authService from "@/services/auth/service";
import ClientPage from "./ClientPage";

export default async function CustomersPage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;
  const user = await authService.getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <ClientPage workspaceId={workspaceId} userId={user.id} />;
}
