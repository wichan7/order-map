export type Order = {
  id?: string;
  workspace_id: string;
  lat: number;
  lng: number;
  phone?: string;
  address?: string;
  address_road?: string;
  memo?: string;
  status?: "registered" | "completed";
  created_at?: Date;
  updated_at?: Date;
};
