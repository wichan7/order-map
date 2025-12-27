"use client";

import { Button } from "@/components/server/Button";
import { Input } from "@/components/server/Input";
import { useOrderBulkUpload } from "@/hooks/useOrderBulkUpload";

export default function ClientPage({ workspaceId }: { workspaceId: string }) {
  const {
    file,
    csvData,
    isProcessing,
    error,
    success,
    progress,
    handleFileChange,
    handleSubmit,
  } = useOrderBulkUpload(workspaceId);

  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = "/sample.csv";
    link.download = "sample.csv";
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        CSV 일괄 등록
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isProcessing}
                label="CSV 파일 선택"
              />
            </div>
            <Button
              variant="ghost"
              onClick={downloadSample}
              disabled={isProcessing}
            >
              샘플 다운로드
            </Button>
          </div>

          {file && !progress && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
              선택된 파일: <strong>{file.name}</strong> ({csvData.length}개
              감지)
            </div>
          )}

          {progress && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>{progress.status}</span>
                <span>
                  {progress.current}/{progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200 text-sm">
              등록 성공!
            </div>
          )}
        </div>

        {/* 미리보기 테이블 */}
        {csvData.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">고객 성함</th>
                  <th className="border p-2 text-left">전화번호</th>
                  <th className="border p-2 text-left">주소</th>
                  <th className="border p-2 text-left">상세 주소</th>
                  <th className="border p-2 text-left">현관 출입 번호</th>
                  <th className="border p-2 text-left">수량</th>
                  <th className="border p-2 text-left">판매 가격</th>
                  <th className="border p-2 text-left">메모</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, i) => (
                  <tr
                    key={`${row.address} ${row.address_detail} ${i}}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="border p-2">{row.customer_name}</td>
                    <td className="border p-2">{row.phone}</td>
                    <td className="border p-2">{row.address}</td>
                    <td className="border p-2">{row.address_detail || "-"}</td>
                    <td className="border p-2">
                      {row.entrance_password || "-"}
                    </td>
                    <td className="border p-2">{row.quantity || "-"}</td>
                    <td className="border p-2">{row.customer_price || "-"}</td>
                    <td className="border p-2">{row.memo || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={csvData.length === 0 || isProcessing}
          className="w-full"
        >
          {isProcessing ? "처리 중..." : "주문 등록하기"}
        </Button>
      </div>
    </div>
  );
}
