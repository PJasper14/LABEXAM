import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Row, Col, Button, Badge, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getOrderById, updateOrderStatus } from '../../services/orderService';
import { Order } from '../../types';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const orderData = await getOrderById(parseInt(id));
        
        if (orderData) {
          setOrder(orderData);
          setNewStatus(orderData.status);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Error loading order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchOrder();
    }
  }, [id, isAuthenticated, isAdmin]);
  
  if (!isAuthenticated || !isAdmin) {
    navigate('/login');
    return null;
  }
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value as Order['status']);
  };
  
  const handleUpdateStatus = async () => {
    if (!order) return;
    
    try {
      setSaving(true);
      const updatedOrder = await updateOrderStatus(order.id, newStatus);
      
      if (updatedOrder) {
        setOrder(updatedOrder);
        setSuccess('Order status updated successfully');
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('An error occurred while updating the order status');
      console.error('Error updating order status:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      default: return 'secondary';
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5">
        <p>Loading order details...</p>
      </Container>
    );
  }
  
  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="mb-4">
          {error || 'Order not found'}
        </Alert>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/orders')}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Orders
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order #{order.id}</h2>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/admin/orders')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Orders
        </Button>
      </div>
      
      {success && (
        <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm mb-4 mb-md-0">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Information</h5>
            </Card.Header>
            <Card.Body>
              <Table className="mb-0">
                <tbody>
                  <tr>
                    <th style={{ width: '40%' }}>Order ID:</th>
                    <td>#{order.id}</td>
                  </tr>
                  <tr>
                    <th>Date:</th>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Customer ID:</th>
                    <td>{order.userId}</td>
                  </tr>
                  <tr>
                    <th>Total Items:</th>
                    <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  </tr>
                  <tr>
                    <th>Total Amount:</th>
                    <td>₱{order.total.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Current Status:</th>
                    <td>
                      <Badge bg={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Update Order Status</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={handleStatusChange}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </Form.Select>
              </Form.Group>
              
              <Button 
                variant="primary" 
                onClick={handleUpdateStatus}
                disabled={saving || newStatus === order.status}
              >
                {saving ? (
                  'Updating...'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Update Status
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Order Items</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.product.id}>
                  <td>
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <div>
                      <h6 className="mb-0">{item.product.name}</h6>
                      <small className="text-muted">{item.product.category}</small>
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
                <th colSpan={4} className="text-end">Total:</th>
                <th>₱{order.total.toFixed(2)}</th>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetail; 