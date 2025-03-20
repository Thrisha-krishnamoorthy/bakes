import { Product, Order, Admin } from './types';

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Sourdough Bread',
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=400',
    price: 7.99,
    quantity: 10,
    category: 'bread'
  },
  {
    id: '2',
    name: 'Chocolate Chip Cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400',
    price: 12.99,
    quantity: 8,
    category: 'cookies'
  },
  {
    id: '3',
    name: 'Blueberry Muffins',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400',
    price: 3.99,
    quantity: 10,
    category: 'pastries'
  },
  {
    id: '4',
    name: 'Artisan Croissants',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400',
    price: 3.49,
    quantity: 9,
    category: 'pastries'
  },
  {
    id: '5',
    name: 'Cinnamon Raisin Bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400',
    price: 6.99,
    quantity: 10,
    category: 'bread'
  },
  {
    id: '6',
    name: 'Lemon Tart',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=400',
    price: 5.99,
    quantity: 7,
    category: 'pastries'
  }
];

const defaultOrders: Order[] = [
  {
    id: 'S1NFNJOY',
    customerName: 'trisha k',
    date: '19/3/2025',
    status: 'pending',
    total: 27.95
  },
  {
    id: 'CQHBD5RC',
    customerName: 'sumithra',
    date: '19/3/2025',
    status: 'pending',
    total: 81.43
  }
];

const adminCredentials: Admin = {
  email: 'admin@bakery.com',
  password: 'admin123'
};

// Initialize localStorage with default data if it doesn't exist
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify(defaultProducts));
}

if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify(defaultOrders));
}

if (!localStorage.getItem('admin')) {
  localStorage.setItem('admin', JSON.stringify(adminCredentials));
}

export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem('products') || '[]');
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};

export const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem('orders') || '[]');
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getAdmin = (): Admin => {
  return JSON.parse(localStorage.getItem('admin') || '{}');
};

export const validateAdmin = (email: string, password: string): boolean => {
  const admin = getAdmin();
  return admin.email === email && admin.password === password;
};