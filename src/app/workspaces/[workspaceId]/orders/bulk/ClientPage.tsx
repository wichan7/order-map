"use client";

import Papa from "papaparse";
import { useState } from "react";
import { Button } from "@/components/server/Button";
import { Input } from "@/components/server/Input";
import type { Order } from "@/services/orders/types";
import tmapService from "@/services/tmap/service";
import { createOrdersBulkAction } from "../actions";

interface Props {
  workspaceId: string;
}

interface CsvRow {
  address: string;
  phone?: string;
  memo?: string;
}

export default function ClientPage({ workspaceId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    status: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("CSV 파일만 업로드 가능합니다.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results) => {
        try {
          const parsed: CsvRow[] = [];
          for (const row of results.data as Array<Record<string, string>>) {
            // 첫 번째 컬럼을 주소로, 두 번째를 전화번호, 세 번째를 메모로 처리
            const values = Object.values(row);
            if (values.length > 0 && values[0]?.trim()) {
              parsed.push({
                address: values[0].trim(),
                phone: values[1]?.trim() || undefined,
                memo: values[2]?.trim() || undefined,
              });
            }
          }
          if (parsed.length === 0) {
            setError("CSV 파일에 유효한 데이터가 없습니다.");
            return;
          }
          setCsvData(parsed);
        } catch (err) {
          setError("CSV 파일을 파싱하는 중 오류가 발생했습니다.");
          console.error(err);
        }
      },
      error: (error) => {
        setError(`CSV 파일을 읽는 중 오류가 발생했습니다: ${error.message}`);
        console.error(error);
      },
    });
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) {
      setError("업로드할 데이터가 없습니다.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProgress({
      current: 0,
      total: csvData.length,
      status: "주소 변환 중...",
    });

    try {
      const orders: Array<
        Omit<Order, "status" | "id" | "created_at" | "updated_at">
      > = [];

      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        setProgress({
          current: i + 1,
          total: csvData.length,
          status: `주소 변환 중... (${i + 1}/${csvData.length})`,
        });

        try {
          const coordinateInfo = await tmapService.findAddressByText(
            row.address,
          );

          if (
            coordinateInfo?.coordinate &&
            coordinateInfo.coordinate.length > 0
          ) {
            const coord = coordinateInfo.coordinate[0];
            orders.push({
              workspace_id: workspaceId,
              lat: parseFloat(coord.lat),
              lng: parseFloat(coord.lon),
              address: row.address,
              phone: row.phone,
              memo: row.memo,
            });
          } else {
            console.warn(`주소를 찾을 수 없습니다: ${row.address}`);
          }
        } catch (err) {
          console.error(`주소 변환 실패: ${row.address}`, err);
        }
      }

      if (orders.length === 0) {
        setError("변환된 주문이 없습니다. 주소를 확인해주세요.");
        setIsProcessing(false);
        setProgress(null);
        return;
      }

      setProgress({
        current: orders.length,
        total: orders.length,
        status: "주문 등록 중...",
      });

      await createOrdersBulkAction(orders);

      setSuccess(true);
      setCsvData([]);
      setFile(null);
      setProgress(null);

      const fileInput = document.getElementById(
        "csv-file-input",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "주문 등록 중 오류가 발생했습니다.",
      );
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
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
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isProcessing}
                label="CSV 파일 선택"
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/sample.csv";
                link.download = "sample.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              disabled={isProcessing}
              className="mb-0"
            >
              샘플 다운로드
            </Button>
          </div>

          {file && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                선택된 파일: <strong>{file.name}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                총 {csvData.length}개의 주문이 감지되었습니다.
              </p>
            </div>
          )}

          {progress && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {progress.status}
                </span>
                <span className="text-sm text-gray-600">
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
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                주문이 성공적으로 등록되었습니다!
              </p>
            </div>
          )}
        </div>

        {csvData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3">
              미리보기
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      주소
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      전화번호
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      메모
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, index) => (
                    <tr
                      key={`${row.address}-${row.phone || ""}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="border border-gray-300 px-3 py-2">
                        {row.address}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {row.phone || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {row.memo || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={csvData.length === 0 || isProcessing}
            className="flex-1"
          >
            {isProcessing ? "처리 중..." : "주문 등록하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
