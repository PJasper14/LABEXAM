export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
  isLoggedIn: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingInfo?: ShippingInfo;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export type CartState = {
  items: CartItem[];
  total: number;
}; 