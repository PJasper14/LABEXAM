import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder } from '../../services/orderService';
import ConfirmModal from '../common/ConfirmModal';

interface ShippingForm {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState<ShippingForm>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: user?.email || '',
    phone: ''
  });
  
  const [validated, setValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      setShippingInfo(prevInfo => ({
        ...prevInfo,
        fullName: user.username || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    if (!user) {
      setError('User information not available. Please log in again.');
      return;
    }
    
    try {
      setIsProcessing(true);
      // Show address verification modal
      setShowAddressModal(true);
    } catch (error) {
      console.error('Error processing order:', error);
      setError('Failed to process your order. Please try again.');
      setIsProcessing(false);
    }
  };
  
  const handleConfirmAddress = async () => {
    setShowAddressModal(false);
    setIsProcessing(true);
    
    try {
      // Process the order
      if (!user) {
        setError('User information not available. Please log in again.');
        setIsProcessing(false);
        return;
      }
      
      const order = await createOrder(user.id, items, total);
      console.log('Order created successfully:', order);
      
      // Add shipping info to order
      const orderWithShipping = {
        ...order,
        shippingInfo: {...shippingInfo}
      };
      
      console.log('Order with shipping info:', orderWithShipping);
      
      // Clear the cart after successful order
      clearCart();
      
      // Store order in sessionStorage as a fallback
      try {
        sessionStorage.setItem('lastOrder', JSON.stringify(orderWithShipping));
        console.log('Order saved to sessionStorage');
      } catch (err) {
        console.error('Failed to save order to sessionStorage:', err);
      }
      
      // Navigate to order confirmation page with order and shipping info
      navigate('/order-confirmation', { 
        state: { 
          order: orderWithShipping
        },
        replace: true // Use replace to prevent back navigation to checkout
      });
    } catch (error) {
      console.error('Error processing order:', error);
      setError('Failed to process your order. Please try again.');
      setIsProcessing(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/cart');
  };
  
  return (
    <Container className="py-5">
      <h2 className="mb-4">Checkout</h2>
      
      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Shipping Information</h5>
            </Card.Header>
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your full name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your address.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your city.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your state.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your ZIP code.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your phone number.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    size="lg"
                    onClick={handleCancel}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      'Processing...'
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled mb-4">
                {items.map(item => (
                  <li key={item.product.id} className="d-flex justify-content-between mb-2">
                    <div>
                      <span className="me-1">{item.quantity} x</span>
                      <span>{item.product.name}</span>
                    </div>
                    <span>₱{(item.product.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total Amount:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Address Verification Modal */}
      <ConfirmModal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        onConfirm={handleConfirmAddress}
        title="Verify Your Address"
        body={
          <>
            <p>Please verify your shipping address:</p>
            <Card className="bg-light">
              <Card.Body>
                <p className="mb-1"><strong>{shippingInfo.fullName}</strong></p>
                <p className="mb-1">{shippingInfo.address}</p>
                <p className="mb-1">{shippingInfo.city}, {shippingInfo.zipCode}</p>
                <p className="mb-1">Phone: {shippingInfo.phone}</p>
                <p className="mb-0">Email: {shippingInfo.email}</p>
              </Card.Body>
            </Card>
            <p className="mt-3 mb-0">Is this information correct?</p>
          </>
        }
        confirmText="Confirm Address"
        variant="success"
      />
    </Container>
  );
};

export default Checkout; 