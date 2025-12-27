export type Order = {
  id?: string;
  workspace_id: string;
  lat: number;
  lng: number;
  phone?: string;
  address?: string;
  address_detail?: string;
  quantity?: string;
  customer_price?: string;
  customer_name?: string;
  entrance_password?: string;
  memo?: string;
  status?: "registered" | "completed";
  created_at?: string;
  updated_at?: string;
};
