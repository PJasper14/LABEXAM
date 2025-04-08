import { Product } from '../types';
import { getProductImageById } from '../assets/imageImports';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features and high-resolution camera.',
    price: 899.99,
    image: getProductImageById(1),
    category: 'Electronics',
    stock: 15,
    featured: true
  },
  {
    id: 2,
    name: 'Laptop Pro',
    description: 'Professional laptop with high performance and long battery life.',
    price: 1299.99,
    image: getProductImageById(2),
    category: 'Electronics',
    stock: 8,
    featured: true
  },
  {
    id: 3,
    name: 'Wireless Earbuds',
    description: 'Premium wireless earbuds with noise cancellation and crystal clear sound.',
    price: 149.99,
    image: getProductImageById(3),
    category: 'Electronics',
    stock: 20
  },
  {
    id: 4,
    name: 'Smart Watch',
    description: 'Feature-rich smart watch with health monitoring and notification features.',
    price: 249.99,
    image: getProductImageById(4),
    category: 'Electronics',
    stock: 12
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    description: 'Portable bluetooth speaker with amazing sound quality and long battery life.',
    price: 79.99,
    image: getProductImageById(5),
    category: 'Electronics',
    stock: 25
  },
  {
    id: 6,
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for casual wear.',
    price: 24.99,
    image: getProductImageById(6),
    category: 'Clothing',
    stock: 50
  },
  {
    id: 7,
    name: 'Jeans',
    description: 'Classic denim jeans with modern fit.',
    price: 59.99,
    image: getProductImageById(7),
    category: 'Clothing',
    stock: 30,
    featured: true
  },
  {
    id: 8,
    name: 'Running Shoes',
    description: 'Lightweight running shoes with excellent cushioning.',
    price: 89.99,
    image: getProductImageById(8),
    category: 'Footwear',
    stock: 15
  },
  {
    id: 9,
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots.',
    price: 39.99,
    image: getProductImageById(9),
    category: 'Accessories',
    stock: 40
  },
  {
    id: 10,
    name: 'Backpack',
    description: 'Durable backpack with laptop compartment and multiple pockets.',
    price: 69.99,
    image: getProductImageById(10),
    category: 'Accessories',
    stock: 20,
    featured: true
  },
  {
    id: 11,
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with timer and multiple brewing options.',
    price: 129.99,
    image: getProductImageById(11),
    category: 'Home & Kitchen',
    stock: 10,
    featured: true
  },
  {
    id: 12,
    name: 'Non-stick Pan',
    description: 'High-quality non-stick frying pan for everyday cooking.',
    price: 34.99,
    image: getProductImageById(12),
    category: 'Home & Kitchen',
    stock: 25
  },
  {
    id: 13,
    name: 'Novel - "The Journey"',
    description: 'Bestselling fiction novel about adventure and discovery.',
    price: 19.99,
    image: getProductImageById(13),
    category: 'Books',
    stock: 60
  },
  {
    id: 14,
    name: 'Basketball',
    description: 'Official size basketball for indoor and outdoor play.',
    price: 29.99,
    image: getProductImageById(14),
    category: 'Sports',
    stock: 35
  },
  {
    id: 15,
    name: 'Yoga Mat',
    description: 'Thick, non-slip yoga mat for comfortable practice.',
    price: 45.99,
    image: getProductImageById(15),
    category: 'Sports',
    stock: 40
  },
  {
    id: 16,
    name: 'Stand Mixer',
    description: 'Professional kitchen stand mixer with multiple attachments for baking and cooking.',
    price: 199.99,
    image: getProductImageById(16),
    category: 'Home & Kitchen',
    stock: 15,
    featured: true
  }
];

// Get all products
export const getAllProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

// Get product by ID
export const getProductById = (id: number): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id);
      resolve(product || null);
    }, 500);
  });
};

// Get featured products
export const getFeaturedProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const featuredProducts = mockProducts.filter(p => p.featured);
      resolve(featuredProducts);
    }, 500);
  });
};

// Search products by query
export const searchProducts = (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      const results = mockProducts.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) || 
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
      );
      resolve(results);
    }, 500);
  });
};

// Create a new product
export const createProduct = (product: Omit<Product, 'id'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = {
        ...product,
        id: mockProducts.length + 1,
        image: product.image || getProductImageById(mockProducts.length + 1)
      };
      mockProducts.push(newProduct);
      resolve(newProduct);
    }, 500);
  });
};

// Update product
export const updateProduct = (id: number, updates: Partial<Product>): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...updates };
        resolve(mockProducts[index]);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Delete product
export const deleteProduct = (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
}; 