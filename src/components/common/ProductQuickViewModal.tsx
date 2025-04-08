import React from 'react';
import { Modal, Button, Row, Col, Image, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faEye } from '@fortawesome/free-solid-svg-icons';

interface ProductQuickViewModalProps {
  show: boolean;
  onHide: () => void;
  product: Product | null;
}

const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  show,
  onHide,
  product
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (product && isAuthenticated) {
      addToCart(product, 1);
      onHide();
    } else if (!isAuthenticated) {
      alert('Please log in to add items to your cart');
    }
  };

  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Image 
              src={product.image} 
              alt={product.name} 
              fluid 
              className="mb-3"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </Col>
          <Col md={6}>
            <h3 className="text-success mb-3">₱{product.price.toFixed(2)}</h3>
            <p className="mb-3">{product.description}</p>
            <p className={`mb-3 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <div className="d-flex align-items-center mb-2">
              <div>Category: </div>
              <Badge bg="secondary" className="ms-2">{product.category}</Badge>
            </div>
            <div className="d-flex mt-4">
              <Button 
                variant="success" 
                className="me-2"
                onClick={handleAddToCart}
                disabled={!isAuthenticated || product.stock <= 0}
              >
                <FontAwesomeIcon icon={faCartPlus} className="me-2" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Link to={`/products/${product.id}`}>
                <Button variant="outline-primary">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductQuickViewModal; 