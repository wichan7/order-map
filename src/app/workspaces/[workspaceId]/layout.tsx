import Link from "next/link";

export default async function WorkspaceLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 네비게이션 바 */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">Workspace</h1>
          </div>

          {/* 메뉴 */}
          <div className="flex items-center gap-6">
            <Link
              href={`/workspaces/${workspaceId}`}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              대시보드
            </Link>
            <Link
              href={`/workspaces/${workspaceId}/settings`}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              설정
            </Link>
          </div>
        </div>
      </nav>

      {/* 콘텐츠 영역 */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
