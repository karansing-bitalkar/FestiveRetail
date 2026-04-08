export type Role = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  festival: string;
  rating: number;
  reviews: number;
  stock: number;
  vendorId: string;
  description: string;
  isCombo?: boolean;
  tags: string[];
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  products: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  address: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'order' | 'offer' | 'system';
}
