import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getProductById } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import ImageGalleryModal from '../common/ImageGalleryModal';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);
  
  // Generate additional product images for the gallery demo (normally these would come from the API)
  const productImages = useMemo(() => {
    if (!product) return [];
    return [
      product.image,
      `https://picsum.photos/seed/product${product?.id}a/800/600`,
      `https://picsum.photos/seed/product${product?.id}b/800/600`,
      `https://picsum.photos/seed/product${product?.id}c/800/600`
    ];
  }, [product]);
  
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;
      
      try {
        const productId = parseInt(id);
        const productData = await getProductById(productId);
        
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error loading product details');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };
    
    fetchProductDetail();
  }, [id]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      if (isAuthenticated) {
        addToCart(product, quantity);
        navigate('/cart');
      } else {
        alert('Please log in to add items to your cart');
        navigate('/login');
      }
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <Container className="py-5">
        <p>Loading product details...</p>
      </Container>
    );
  }
  
  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Product not found'}</Alert>
        <Button variant="outline-primary" onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Products
        </Button>
      </Container>
    );
  }
  
  return (
    <>
      <Container className="py-5">
        <Button variant="outline-primary" className="mb-4" onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Products
        </Button>
        
        <Card className="border-0 shadow-sm mb-4">
          <Row className="g-0">
            <Col md={6}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="img-fluid rounded cursor-pointer" 
                style={{ width: '100%', objectFit: 'cover' }}
                onClick={() => setShowGallery(true)}
              />
              <div className="d-flex mt-3">
                {productImages.slice(0, 4).map((img, index) => (
                  <div 
                    key={index} 
                    className="me-2" 
                    style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                    onClick={() => setShowGallery(true)}
                  >
                    <img 
                      src={img} 
                      alt={`Product view ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      className="border rounded"
                    />
                  </div>
                ))}
              </div>
            </Col>
            <Col md={6}>
              <Card.Body className="d-flex flex-column h-100 p-4">
                <Card.Title as="h2" className="mb-3">{product.name}</Card.Title>
                <Card.Subtitle className="mb-3 text-primary fs-3 fw-bold">
                  ₱{product.price.toFixed(2)}
                </Card.Subtitle>
                
                <Card.Text className="mb-4">
                  {product.description}
                </Card.Text>
                
                <div className="mb-3">
                  <p className={`mb-2 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                    {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                  </p>
                  <p className="mb-0 text-muted">Category: {product.category}</p>
                </div>
                
                {product.stock > 0 && (
                  <div className="mt-auto">
                    <Row className="align-items-center mb-3">
                      <Col xs={4}>
                        <Form.Label>Quantity:</Form.Label>
                      </Col>
                      <Col xs={8}>
                        <Form.Control
                          type="number"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={handleQuantityChange}
                        />
                      </Col>
                    </Row>
                    
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-100"
                      onClick={handleAddToCart}
                      disabled={!isAuthenticated}
                    >
                      <FontAwesomeIcon icon={faCartPlus} className="me-2" />
                      Add to Cart
                    </Button>
                    
                    {!isAuthenticated && (
                      <div className="mt-2 text-center">
                        <small className="text-danger">
                          Please log in to add items to your cart
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        show={showGallery}
        onHide={() => setShowGallery(false)}
        images={productImages}
        title={product?.name}
      />
    </>
  );
};

export default ProductDetail; 