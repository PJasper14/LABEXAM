import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faShoppingBag, 
  faTruck, 
  faPlus, 
  faEdit, 
  faEye,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';
import { Product, Order } from '../../types';

const AdminDashboard: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          getAllProducts(),
          getAllOrders()
        ]);
        
        setProducts(productsData);
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);
  
  // If not admin, redirect to home
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }
  
  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'success';
      case 'shipped': return 'success';
      case 'delivered': return 'success';
      default: return 'secondary';
    }
  };
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Get recent orders
  const recentOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  // Get low stock products
  const lowStockProducts = products.filter(product => product.stock < 10);
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/products/new">
          <Button 
            variant="primary"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Product
          </Button>
        </Link>
      </div>
      
      {/* Summary Cards */}
      <Row className="mb-5">
        <Col md={4}>
          <Card className="shadow-sm mb-4 mb-md-0">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <FontAwesomeIcon icon={faBox} size="2x" className="text-success" />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Products</h6>
                <h3 className="mb-0">{products.length}</h3>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-0">
              <Link to="/admin/products">
                <Button
                  variant="outline-primary"
                  size="sm"
                >
                  <FontAwesomeIcon icon={faBox} className="me-2" />
                  Manage Products
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm mb-4 mb-md-0">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <FontAwesomeIcon icon={faShoppingBag} size="2x" className="text-success" />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Orders</h6>
                <h3 className="mb-0">{orders.length}</h3>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-0">
              <Link to="/admin/orders">
                <Button
                  variant="outline-success"
                  size="sm"
                >
                  <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                  Manage Orders
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <FontAwesomeIcon icon={faTruck} size="2x" className="text-success" />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Revenue</h6>
                <h3 className="mb-0">₱{totalRevenue.toFixed(2)}</h3>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-0">
              <Link to="/admin/reports">
                <Button
                  variant="outline-success"
                  size="sm"
                >
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />
                  View Reports
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Orders Table */}
      <h4 className="mb-3">Recent Orders</h4>
      <Card className="shadow-sm mb-5">
        <Card.Body>
          {loading ? (
            <p>Loading recent orders...</p>
          ) : recentOrders.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.userId}</td>
                    <td>₱{order.total.toFixed(2)}</td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
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
            <p>No recent orders found.</p>
          )}
        </Card.Body>
      </Card>
      
      {/* Low Stock Products */}
      <h4 className="mb-3">Low Stock Products</h4>
      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <p>Loading low stock products...</p>
          ) : lowStockProducts.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map(product => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>{product.name}</td>
                    <td>₱{product.price.toFixed(2)}</td>
                    <td className="text-danger fw-bold">{product.stock}</td>
                    <td>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link to={`/products/${product.id}`}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
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
            <p>No low stock products found.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard; 