import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Image, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingBag, faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmModal from '../common/ConfirmModal';

const ShoppingCart: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState<number | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>You need to log in first!</h4>
          <p>Please log in to view your cart and make purchases.</p>
          <div>
            <Link to="/login" className="me-2">
              <Button variant="primary">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline-primary">
                Register
              </Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }
  
  const handleQuantityChange = (productId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };
  
  const handleRemoveItem = (productId: number) => {
    setProductToRemove(productId);
    setShowRemoveModal(true);
  };
  
  const confirmRemoveItem = () => {
    if (productToRemove !== null) {
      removeFromCart(productToRemove);
      setShowRemoveModal(false);
      setProductToRemove(null);
    }
  };
  
  const handleClearCart = () => {
    setShowClearCartModal(true);
  };
  
  const confirmClearCart = () => {
    clearCart();
    setShowClearCartModal(false);
  };
  
  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };
  
  const confirmCheckout = () => {
    setShowCheckoutModal(false);
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center mb-4">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products">
            <Button variant="primary">
              <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <h2 className="mb-4">Your Shopping Cart</h2>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.product.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image 
                            src={item.product.image} 
                            alt={item.product.name} 
                            width={60} 
                            height={60} 
                            className="me-3"
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <Link to={`/products/${item.product.id}`} className="text-decoration-none">
                              <h6 className="mb-0">{item.product.name}</h6>
                            </Link>
                            <small className="text-muted">{item.product.category}</small>
                          </div>
                        </div>
                      </td>
                      <td>₱{item.product.price.toFixed(2)}</td>
                      <td style={{ width: '120px' }}>
                        <Form.Control
                          type="number"
                          min="1"
                          max={item.product.stock}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, e as React.ChangeEvent<HTMLInputElement>)}
                          size="sm"
                        />
                      </td>
                      <td>₱{(item.product.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer className="bg-white">
              <div className="d-flex justify-content-between">
                <Link to="/products">
                  <Button variant="outline-secondary">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button 
                  variant="outline-danger" 
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100" 
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Remove Item Confirmation Modal */}
      <ConfirmModal
        show={showRemoveModal}
        onHide={() => setShowRemoveModal(false)}
        onConfirm={confirmRemoveItem}
        title="Remove Item"
        body={
          <>
            <div className="text-center mb-3">
              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-warning" />
            </div>
            <p>Are you sure you want to remove this item from your cart?</p>
          </>
        }
        confirmText="Remove Item"
        variant="danger"
      />
      
      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        show={showClearCartModal}
        onHide={() => setShowClearCartModal(false)}
        onConfirm={confirmClearCart}
        title="Clear Cart"
        body={
          <>
            <div className="text-center mb-3">
              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-warning" />
            </div>
            <p>Are you sure you want to clear all items from your cart?</p>
            <p className="text-danger mb-0">This action cannot be undone.</p>
          </>
        }
        confirmText="Clear Cart"
        variant="danger"
      />
      
      {/* Checkout Confirmation Modal */}
      <ConfirmModal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
        onConfirm={confirmCheckout}
        title="Proceed to Checkout"
        body={
          <>
            <div className="mb-3">
              <h6>Order Summary</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({items.length}):</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
            <p>Do you want to proceed to checkout?</p>
          </>
        }
        confirmText="Proceed"
        variant="success"
      />
    </Container>
  );
};

export default ShoppingCart; 