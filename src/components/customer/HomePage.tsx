import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../../services/productService';
import { Product } from '../../types';
import ProductCard from '../common/ProductCard';
import { images } from '../../assets/imageImports';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt, faBook, faFootball, faLaptop, faUtensils, faSocks } from '@fortawesome/free-solid-svg-icons';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const featured = await getFeaturedProducts();
        setFeaturedProducts(featured);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Category data with icons and images
  const categories = [
    {
      name: 'Electronics',
      icon: faLaptop,
      image: 'https://picsum.photos/seed/electronics/600/400',
      color: '#4285F4' // Google Blue
    },
    {
      name: 'Clothing',
      icon: faShirt,
      image: 'https://picsum.photos/seed/clothing/600/400',
      color: '#EA4335' // Google Red
    },
    {
      name: 'Footwear',
      icon: faSocks,
      image: 'https://picsum.photos/seed/footwear/600/400',
      color: '#FBBC05' // Google Yellow
    },
    {
      name: 'Accessories',
      icon: faShirt,
      image: 'https://picsum.photos/seed/accessories/600/400',
      color: '#34A853' // Google Green
    },
    {
      name: 'Home & Kitchen',
      icon: faUtensils,
      image: 'https://picsum.photos/seed/kitchen/600/400',
      color: '#7B1FA2' // Purple
    },
    {
      name: 'Books',
      icon: faBook,
      image: 'https://picsum.photos/seed/books/600/400',
      color: '#FF5722' // Deep Orange
    },
    {
      name: 'Sports',
      icon: faFootball,
      image: 'https://picsum.photos/seed/sports/600/400',
      color: '#0097A7' // Cyan
    }
  ];

  return (
    <Container>
      {/* Hero Banner */}
      <Card className="mb-5 text-white border-0 rounded-0">
        <Card.Img  
          src="https://picsum.photos/seed/ecommerce/1200/400"
          alt="Welcome Banner"
          style={{ height: '400px', objectFit: 'cover' }}
          className="rounded-3"
        />
        <Card.ImgOverlay className="d-flex flex-column justify-content-center align-items-center text-center bg-dark bg-opacity-50 rounded-3">
          <Card.Title className="display-4 fw-bold">Welcome to StarBzzz</Card.Title>
          <Card.Text className="fs-5 mb-4">
            Discover our wide range of products across multiple categories
          </Card.Text>
          <Link to="/products">
            <Button variant="primary" size="lg">Shop Now</Button>
          </Link>
        </Card.ImgOverlay>
      </Card>

      {/* Featured Products Section */}
      <h2 className="mb-4">Featured Products</h2>
      {loading ? (
        <p>Loading featured products...</p>
      ) : (
        <>
          {featuredProducts.length > 0 ? (
            <Row xs={1} md={2} lg={4} className="g-4 mb-5">
              {featuredProducts.map(product => (
                <Col key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <p>No featured products available at the moment.</p>
          )}
        </>
      )}

      {/* Categories Section */}
      <h2 className="mb-4">Shop by Category</h2>
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {categories.map((category, index) => (
          <Col key={index}>
            <Card className="h-100 shadow-sm overflow-hidden">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={category.image}
                  alt={category.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div 
                  className="position-absolute top-0 start-0 p-2 rounded-bottom-end" 
                  style={{ backgroundColor: category.color, width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <FontAwesomeIcon icon={category.icon} className="text-white" />
                </div>
              </div>
              <Card.Body className="text-center">
                <Card.Title>{category.name}</Card.Title>
                <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                  <Button variant="outline-primary">Browse {category.name}</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Promotional Banner */}
      <Card className="mb-5 text-white border-0">
        <Card.Img 
          src="https://picsum.photos/seed/sale/1200/300"
          alt="Special Promotion"
          style={{ height: '200px', objectFit: 'cover' }}
          className="rounded-3"
        />
        <Card.ImgOverlay className="d-flex flex-column justify-content-center align-items-center text-center bg-success bg-opacity-75 rounded-3">
          <Card.Title className="h3 fw-bold">New Collections Added!</Card.Title>
          <Card.Text className="mb-3">
            Explore our latest products from various categories
          </Card.Text>
          <Link to="/products">
            <Button variant="light">Shop Now</Button>
          </Link>
        </Card.ImgOverlay>
      </Card>
    </Container>
  );
};

export default HomePage; 