export type Order = {
  id?: string;
  workspace_id: string;
  lat: number;
  lng: number;
  phone?: string;
  address?: string;
  memo?: string;
  status?: "registered" | "completed";
  created_at?: string;
  updated_at?: string;
};
