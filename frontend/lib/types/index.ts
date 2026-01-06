export interface Product {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  category: string;
  price_dzd: number;
  stock_quantity: number;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  weight?: number;
  created_at: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItemCreate {
  product_id: string;
  quantity: number;
}

export interface GuestOrderCreate {
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  delivery_address: string;
  wilaya: string;
  items: OrderItemCreate[];
  delivery_type: 'pickup' | 'delivery';
}

export interface OrderResponse {
  id: string;
  status: string;
  item: Array<[ProductInfo, number]>;
  delivery_type: string;
  delivery_address?: string;
  delivery_phone?: string;
  zr_tracking_id?: string;
  created_at: string;
  is_guest_order: boolean;
  guest_name?: string;
  guest_phone?: string;
  guest_email?: string;
  wilaya?: string;
}

export interface ProductInfo {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  category: string;
  price_dzd: number;
}

// Algerian Wilayas
export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra",
  "Bechar", "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida", "Skikda",
  "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj",
  "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent",
  "Ghardaia", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal",
  "Beni Abbes", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];
