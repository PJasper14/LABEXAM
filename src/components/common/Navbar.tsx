import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Badge, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUser, 
  faSignOutAlt, 
  faSignInAlt, 
  faUserPlus, 
  faTachometerAlt, 
  faBoxes, 
  faShoppingBag
} from '@fortawesome/free-solid-svg-icons';
import { images } from '../../assets/imageImports';
import ConfirmModal from './ConfirmModal';

const NavigationBar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  // Different navigation based on user role
  const renderNavLinks = () => {
    if (isAdmin) {
      // Admin navigation
      return (
        <>
          <Nav.Link as={Link} to="/admin/dashboard">
            <FontAwesomeIcon icon={faTachometerAlt} className="me-1" />
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/products">
            <FontAwesomeIcon icon={faBoxes} className="me-1" />
            Products
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/orders">
            <FontAwesomeIcon icon={faShoppingBag} className="me-1" />
            Orders
          </Nav.Link>
        </>
      );
    } else {
      // Customer navigation
      return (
        <>
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/products">Products</Nav.Link>
        </>
      );
    }
  };

  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg" sticky="top" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to={isAdmin ? '/admin/dashboard' : '/'}>
            <Image 
              src={images.logo} 
              alt="E-Commerce Store Logo"
              height="30"
              className="d-inline-block align-top me-2"
            />
            {isAdmin ? 'StarBzzz Admin' : 'StarBzzz'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {renderNavLinks()}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  {/* Only show cart for customers, not admins */}
                  {!isAdmin && (
                    <Nav.Link as={Link} to="/cart" className="position-relative me-3">
                      <FontAwesomeIcon icon={faShoppingCart} />
                      {items.length > 0 && (
                        <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                          {items.reduce((total, item) => total + item.quantity, 0)}
                        </Badge>
                      )}
                    </Nav.Link>
                  )}
                  <Nav.Link className="me-2">
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    {user?.username}
                    {isAdmin && <span className="ms-1 small">(Admin)</span>}
                  </Nav.Link>
                  <Button variant="outline-light" size="sm" onClick={handleLogoutClick}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="me-2">
                    <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    <FontAwesomeIcon icon={faUserPlus} className="me-1" />
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        body="Are you sure you want to log out of your account?"
        confirmText="Logout"
        variant="danger"
      />
    </>
  );
};

export default NavigationBar; 