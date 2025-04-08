import { Order, CartItem } from '../types';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 1,
    userId: 2,
    items: [
      {
        product: {
          id: 1,
          name: 'Smartphone X',
          description: 'Latest smartphone with advanced features',
          price: 699.99,
          image: 'https://via.placeholder.com/300',
          category: 'Electronics',
          stock: 50
        },
        quantity: 1
      }
    ],
    total: 699.99,
    status: 'delivered',
    createdAt: '2023-01-15T14:22:30Z'
  },
  {
    id: 2,
    userId: 2,
    items: [
      {
        product: {
          id: 3,
          name: 'Wireless Headphones',
          description: 'Premium sound quality with noise cancellation',
          price: 199.99,
          image: 'https://via.placeholder.com/300',
          category: 'Electronics',
          stock: 100
        },
        quantity: 2
      }
    ],
    total: 399.98,
    status: 'shipped',
    createdAt: '2023-02-05T09:45:12Z'
  }
];

// Simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a new order
export const createOrder = async (userId: number, items: CartItem[], total: number): Promise<Order> => {
  await delay(700);
  
  const newOrder: Order = {
    id: Math.max(...mockOrders.map(o => o.id)) + 1,
    userId,
    items,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockOrders.push(newOrder);
  return newOrder;
};

// Get orders by user ID
export const getOrdersByUser = async (userId: number): Promise<Order[]> => {
  await delay(500);
  return mockOrders.filter(order => order.userId === userId);
};

// Get all orders (for admin)
export const getAllOrders = async (): Promise<Order[]> => {
  await delay(600);
  return [...mockOrders];
};

// Update order status (for admin)
export const updateOrderStatus = async (orderId: number, status: Order['status']): Promise<Order | undefined> => {
  await delay(400);
  
  const index = mockOrders.findIndex(order => order.id === orderId);
  if (index === -1) return undefined;
  
  mockOrders[index] = { ...mockOrders[index], status };
  return mockOrders[index];
};

// Get order by ID
export const getOrderById = async (orderId: number): Promise<Order | undefined> => {
  await delay(300);
  return mockOrders.find(order => order.id === orderId);
}; 