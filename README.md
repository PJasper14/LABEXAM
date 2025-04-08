# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# E-Commerce System

A comprehensive e-commerce system built with React, TypeScript, and Bootstrap.

## Features

- Customer-facing storefront with product browsing, cart management, and checkout
- Admin dashboard for product and order management
- Authentication and authorization
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd e-commerce-system

# Install dependencies
npm install

# Start the development server
npm start
```

## Adding Images to the Project

You can add images to the project in several ways:

### 1. Using Static Assets

1. Place your image files in the `src/assets/images/products` directory.
2. Import them in your components:

```tsx
// Direct import in a component
import productImage from '../assets/images/products/my-product.jpg';

// Then use it in your JSX
<img src={productImage} alt="Product" />
```

### 2. Using the Image Helper

We've created an image helper to centralize image management:

1. Place your image files in the appropriate directories:
   - Product images: `src/assets/images/products/`
   - Logo: `src/assets/images/logo.png`
   - Banner: `src/assets/images/home-banner.jpg`

2. Update the imports in `src/assets/imageImports.ts`:

```tsx
// Product images
import product1 from './images/products/product1.jpg';
import product2 from './images/products/product2.jpg';
// Add more imports as needed

// Logo and banner images
import logo from './images/logo.png';
import homeBanner from './images/home-banner.jpg';

// Export all images
export const images = {
  products: {
    product1,
    product2,
    // Add more products here
    defaultProductImage
  },
  logo,
  homeBanner
};
```

3. Use the images in your components:

```tsx
import { images, getProductImageById } from '../assets/imageImports';

// Use a specific image
<img src={images.products.product1} alt="Product 1" />

// Or get by product ID
<img src={getProductImageById(productId)} alt="Product" />
```

### 3. Using the Image Uploader

For admin functionality, use the ImageUploader component:

```tsx
import ImageUploader from '../components/common/ImageUploader';

const MyComponent = () => {
  const [imageUrl, setImageUrl] = useState('');
  
  return (
    <ImageUploader
      initialImage={imageUrl}
      onImageChange={setImageUrl}
      label="Upload Image"
    />
  );
};
```

## File Structure

```
src/
├── assets/           # Static assets like images and styles
├── components/       # React components
│   ├── admin/        # Admin-specific components
│   ├── common/       # Shared components
│   └── customer/     # Customer-facing components
├── contexts/         # React context providers
├── services/         # API and data services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
