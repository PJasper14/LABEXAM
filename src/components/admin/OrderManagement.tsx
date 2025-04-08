import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, InputGroup, Card, Alert } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { Order } from '../../types';

const OrderManagement: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchOrders();
    }
  }, [isAuthenticated, isAdmin]);
  
  // Redirect if not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.id.toString().includes(value) ||
        order.userId.toString().includes(value)
      );
      setFilteredOrders(filtered);
    }
  };
  
  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      if (updatedOrder) {
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        
        setOrders(updatedOrders);
        setFilteredOrders(
          searchTerm.trim() === '' 
            ? updatedOrders 
            : updatedOrders.filter(order => 
                order.id.toString().includes(searchTerm) ||
                order.userId.toString().includes(searchTerm)
              )
        );
      }
    } catch (err) {
      setError('Failed to update order status');
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
  
  return (
    <Container className="py-5">
      <h2 className="mb-4">Order Management</h2>
      
      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by order ID or customer ID..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Card.Body>
      </Card>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length > 0 ? (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.userId}</td>
                <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                <td>₱{order.total.toFixed(2)}</td>
                <td>
                  <Form.Select 
                    size="sm"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    style={{ width: '130px' }}
                    className={`bg-${getStatusBadgeVariant(order.status)} bg-opacity-10`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </Form.Select>
                </td>
                <td>
                  <Link to={`/admin/orders/${order.id}`}>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">
          No orders found {searchTerm ? 'matching your search criteria' : ''}.
        </Alert>
      )}
    </Container>
  );
};

export default OrderManagement; 