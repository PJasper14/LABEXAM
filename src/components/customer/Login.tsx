import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to homepage
  const from = location.state?.from?.pathname || '/';
  
  // If already authenticated, redirect based on role
  if (isAuthenticated) {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate(from);
    }
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = login(email, password);
      
      if (success) {
        // Check if user is admin and redirect accordingly
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          // For regular customers, redirect to the page they were trying to access or homepage
          navigate(from);
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-0">Login</h2>
                <p className="text-muted mt-2">Sign in to your account</p>
              </div>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid mb-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      'Signing in...'
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none">
                    <FontAwesomeIcon icon={faUserPlus} className="me-1" />
                    Sign Up
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 