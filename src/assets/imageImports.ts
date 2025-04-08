// Product images - Replace these with actual image imports once you add the image files
import product1 from './images/products/product1.jpg';
import product2 from './images/products/product2.jpg';
import product3 from './images/products/product3.jpg';
import product4 from './images/products/product4.jpg';
import product5 from './images/products/product5.jpg';
import defaultProductImage from './images/products/default-product.jpg';

// Logo and banner images - Replace these with actual image imports once you add the image files  
import logo from './images/Logo.png';
import homeBanner from './images/home-banner.png';

// Placeholder function for development until actual images are added
const placeholderImage = (id: number): string => 
  `https://picsum.photos/seed/product${id}/600/400`;

// Export all images
export const images = {
  products: {
    product1: placeholderImage(1),
    product2: placeholderImage(2),
    product3: placeholderImage(3),
    product4: placeholderImage(4),
    product5: placeholderImage(5),
    product6: placeholderImage(6),
    product7: placeholderImage(7),
    product8: placeholderImage(8),
    product9: placeholderImage(9),
    product10: placeholderImage(10),
    product11: placeholderImage(11),
    product12: placeholderImage(12),
    product13: placeholderImage(13),
    product14: placeholderImage(14),
    product15: placeholderImage(15),
    product16: placeholderImage(16),
    defaultProductImage: 'https://picsum.photos/600/400?grayscale'
  },
  logo,
  homeBanner
};

// Helper function to get product image by ID or return default
export const getProductImageById = (id: number): string => {
  const productKey = `product${id}` as keyof typeof images.products;
  return images.products[productKey] || images.products.defaultProductImage;
};

export default images; 