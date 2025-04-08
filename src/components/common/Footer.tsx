import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-success text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>StarBzzz</h5>
            <p className="text-muted">
              Your one-stop shop for all your needs.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-muted">Home</a></li>
              <li><a href="/products" className="text-decoration-none text-muted">Products</a></li>
              <li><a href="/cart" className="text-decoration-none text-muted">Cart</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <address className="text-muted">
              <p>123 StarBzzz St.</p>
              <p>New York, NY 10001</p>
              <p>Email: info@ecommerce.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </Col>
        </Row>
        <hr className="my-3 bg-secondary" />
        <Row>
          <Col className="text-center text-muted">
            <p className="mb-0">&copy; {new Date().getFullYear()}  StarBzzz. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 