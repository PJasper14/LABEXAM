import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShoppingBag, faPrint, faHome } from '@fortawesome/free-solid-svg-icons';
import { Order } from '../../types';

interface LocationState {
  order: Order;
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Debugging - log raw state on component mount and try to get order from multiple sources
  useEffect(() => {
    // Try to get order from location state first
    console.log('OrderConfirmation - Raw location state:', location.state);
    
    if (location.state && (location.state as LocationState).order) {
      const orderFromState = (location.state as LocationState).order;
      console.log('Order data from location state:', orderFromState);
      setOrderData(orderFromState);
      return;
    }
    
    // If not in location state, try sessionStorage
    try {
      const savedOrder = sessionStorage.getItem('lastOrder');
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        console.log('Order data from sessionStorage:', parsedOrder);
        setOrderData(parsedOrder);
        return;
      }
    } catch (err) {
      console.error('Error retrieving order from sessionStorage:', err);
    }
    
    // If we get here, no order was found
    console.error('No order data found in any storage');
    setError('Order information could not be found');
  }, [location.state]);
  
  // Only redirect if there's an error and no order data
  useEffect(() => {
    if (!orderData && error) {
      console.warn('No order data provided, redirecting to home');
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [orderData, error, navigate]);
  
  const handlePrint = () => {
    window.print();
  };
  
  // Show loading state if still processing
  if (!orderData && !error) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </Container>
    );
  }
  
  // Show error state
  if (error || !orderData) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h4>Order Information Not Found</h4>
          <p>We couldn't find your order details. You may have refreshed the page or accessed this page directly.</p>
          <p>You will be redirected to the homepage in a few seconds...</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Return to Home Now
          </Button>
        </Alert>
      </Container>
    );
  }
  
  // Show order confirmation when data is available
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <FontAwesomeIcon 
          icon={faCheckCircle} 
          size="4x" 
          className="text-success mb-3" 
        />
        <h2>Thank You for Your Order!</h2>
        <p className="lead">
          Your order has been received and is being processed.
        </p>
        <p>
          Order Number: <strong>#{orderData.id}</strong> | 
          Date: <strong>{new Date(orderData.createdAt).toLocaleDateString()}</strong>
        </p>
      </div>
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Order Summary</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive className="mb-0">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map(item => (
                <tr key={item.product.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        className="me-3"
                      />
                      <div>
                        <h6 className="mb-0">{item.product.name}</h6>
                        <small className="text-muted">{item.product.category}</small>
                      </div>
                    </div>
                  </td>
                  <td>₱{item.product.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>₱{(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end fw-bold">Subtotal:</td>
                <td>₱{orderData.total.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-end fw-bold">Shipping:</td>
                <td>Free</td>
              </tr>
              <tr className="border-top">
                <td colSpan={3} className="text-end fw-bold">Total:</td>
                <td>₱{orderData.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm mb-5">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Shipping Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Delivery Address</h6>
              {orderData.shippingInfo ? (
                <>
                  <p className="mb-0"><strong>{orderData.shippingInfo.fullName}</strong></p>
                  <p className="mb-0">{orderData.shippingInfo.address}</p>
                  <p className="mb-0">{orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.zipCode}</p>
                  <p className="mb-0">Phone: {orderData.shippingInfo.phone}</p>
                  <p className="mb-0">Email: {orderData.shippingInfo.email}</p>
                </>
              ) : (
                <p className="mb-0">Shipping information not available</p>
              )}
            </Col>
            <Col md={6}>
              <h6>Order Status</h6>
              <p className="mb-0">
                Status: <span className="badge bg-warning">{orderData.status}</span>
              </p>
              <p className="mb-0">
                Expected Delivery: {new Date(
                  new Date(orderData.createdAt).setDate(
                    new Date(orderData.createdAt).getDate() + 5
                  )
                ).toLocaleDateString()}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between">
        <Link to="/">
          <Button
            variant="outline-primary"
          >
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Return to Homepage
          </Button>
        </Link>
        
        <Button
          variant="outline-secondary"
          onClick={handlePrint}
        >
          <FontAwesomeIcon icon={faPrint} className="me-2" />
          Print Receipt
        </Button>
      </div>
    </Container>
  );
};

export default OrderConfirmation; 