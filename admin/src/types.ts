export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: 'bread' | 'cookies' | 'pastries';
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: 'pending' | 'shipped';
  total: number;
}

export interface Admin {
  email: string;
  password: string;
}