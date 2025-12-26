import Papa from "papaparse";
import { useState } from "react";
import { createOrdersBulkAction } from "@/app/workspaces/[workspaceId]/orders/actions";
import type { Order } from "@/services/orders/types";
import tmapService from "@/services/tmap/service";

interface CsvRow {
  address: string;
  address_detail?: string;
  quantity?: string;
  customer_price?: string;
  phone?: string;
  memo?: string;
}

interface Progress {
  current: number;
  total: number;
  status: string;
}

export function useOrderBulkUpload(workspaceId: string) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

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
        const parsed: CsvRow[] = [];
        for (const row of results.data as Array<Record<string, string>>) {
          const values = Object.values(row);
          if (values.length > 0 && values[0]?.trim()) {
            parsed.push({
              address: values[0].trim(),
              address_detail: values[1].trim() || undefined,
              quantity: values[2].trim() || undefined,
              customer_price: values[3].trim() || undefined,
              phone: values[4]?.trim() || undefined,
              memo: values[5]?.trim() || undefined,
            });
            console.log(parsed);
          }
        }
        if (parsed.length === 0) {
          setError("CSV 파일에 유효한 데이터가 없습니다.");
        } else {
          setCsvData(parsed);
        }
      },
      error: (err) => setError(`파일 읽기 오류: ${err.message}`),
    });
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

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

        let lat = 0;
        let lng = 0;

        try {
          const coordinateInfo = await tmapService.findAddressByText(
            row.address,
          );

          if (coordinateInfo?.coordinate?.[0]) {
            const coord = coordinateInfo.coordinate[0];
            lat = parseFloat(coord.lat);
            lng = parseFloat(coord.lon);
          } else {
            console.warn(`좌표를 찾을 수 없는 주소: ${row.address}`);
          }
        } catch (err) {
          console.error(`Tmap 서비스 호출 중 오류 발생 (${row.address}):`, err);
        }

        orders.push({
          workspace_id: workspaceId,
          lat: lat,
          lng: lng,
          address: row.address,
          address_detail: row.address_detail,
          quantity: row.quantity,
          customer_price: row.customer_price,
          phone: row.phone,
          memo: row.memo,
        });
      }

      if (orders.length === 0) {
        throw new Error("처리할 데이터가 없습니다.");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  return {
    file,
    csvData,
    isProcessing,
    error,
    success,
    progress,
    handleFileChange,
    handleSubmit,
  };
}
