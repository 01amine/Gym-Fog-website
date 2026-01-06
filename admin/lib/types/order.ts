import { Material } from "./material";

export interface SerializedOrder {
  id: string;
  appointment_date: string;
  status: OrderStatus;
  item: [Material, number][];
}

export type Orders = SerializedOrder[];

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  READY = "ready",
  DELIVERED = "delivered",
  OUT_FOR_DELIVERY = "out_for_delivery"
}

export interface AdmindOrder {
  _id: string
  client: {
    full_name: string | null
    email: string | null
    phone?: string | null
  }
  is_guest_order: boolean
  item: [
    {
      title: string
      category: string
      price_dzd: number
    },
    number
  ][]
  status: "pending" | "accepted" | "declined" | "ready" | "delivered" | "out_for_delivery"
  delivery_type: "pickup" | "delivery"
  delivery_address: string | null
  delivery_phone: string | null
  wilaya: string | null
  zr_tracking_id: string | null
  created_at: string
}
