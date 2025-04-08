import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faEye, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import ProductQuickViewModal from './ProductQuickViewModal';
import ConfirmModal from './ConfirmModal';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showQuickView, setShowQuickView] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      alert('Please log in to add items to your cart');
      return;
    }
    
    if (product.stock <= 0) {
      return;
    }
    
    setShowAddToCartModal(true);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setShowAddToCartModal(false);
    setAddedToCart(true);
    
    // Reset the added to cart status after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleOpenQuickView = () => {
    setShowQuickView(true);
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
  };

  return (
    <>
      <Card className="h-100 product-card shadow-sm">
        {product.featured && (
          <div className="position-absolute top-0 end-0 m-2">
            <Badge bg="warning" text="dark">Featured</Badge>
          </div>
        )}
        <div className="position-relative">
          <Card.Img 
            variant="top" 
            src={product.image} 
            alt={product.name}
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <Button
            variant="light"
            size="sm"
            className="position-absolute top-50 start-50 translate-middle"
            style={{ 
              opacity: 0, 
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }}
            onClick={handleOpenQuickView}
          >
            <FontAwesomeIcon icon={faSearch} className="me-1" />
            Quick View
          </Button>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title>{product.name}</Card.Title>
          <Card.Text className="text-muted small text-truncate">{product.description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="fw-bold">₱{product.price.toFixed(2)}</span>
            <div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={handleOpenQuickView}
              >
                <FontAwesomeIcon icon={faSearch} className="me-1" />
                Quick View
              </Button>
              <Button 
                variant={addedToCart ? "outline-success" : "success"}
                size="sm"
                onClick={handleAddToCartClick}
                disabled={!isAuthenticated || product.stock <= 0}
              >
                <FontAwesomeIcon icon={addedToCart ? faCheck : faCartPlus} className="me-1" />
                {addedToCart ? "Added" : "Add"}
              </Button>
            </div>
          </div>
          <div className="mt-2 small text-muted">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        </Card.Body>
      </Card>

      {/* Quick View Modal */}
      <ProductQuickViewModal 
        show={showQuickView} 
        onHide={handleCloseQuickView} 
        product={product} 
      />

      {/* Add to Cart Confirmation Modal */}
      <ConfirmModal
        show={showAddToCartModal}
        onHide={() => setShowAddToCartModal(false)}
        onConfirm={handleAddToCart}
        title="Add to Cart"
        body={
          <>
            <div className="d-flex align-items-center mb-3">
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                className="me-3"
              />
              <div>
                <div className="fw-bold">{product.name}</div>
                <div className="text-success">₱{product.price.toFixed(2)}</div>
              </div>
            </div>
            <p>Are you sure you want to add this item to your cart?</p>
          </>
        }
        confirmText="Add to Cart"
        variant="success"
      />
    </>
  );
};

export default ProductCard; 