import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getProductById, createProduct, updateProduct } from '../../services/productService';
import { Product } from '../../types';
import ImageUploader from '../common/ImageUploader';
import { images } from '../../assets/imageImports';
import ConfirmModal from '../common/ConfirmModal';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    image: images.products.defaultProductImage,
    category: '',
    stock: 0,
    featured: false
  });
  
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
      return;
    }
    
    const fetchProduct = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const productId = parseInt(id);
          const product = await getProductById(productId);
          
          if (product) {
            // Remove id from product as it's handled separately
            const { id, ...productData } = product;
            setFormData(productData);
          } else {
            setError('Product not found');
            navigate('/admin/products');
          }
        } catch (err) {
          setError('Error loading product data');
          console.error('Error fetching product:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id, isEditMode, isAuthenticated, isAdmin, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (imageDataUrl: string) => {
    setFormData({
      ...formData,
      image: imageDataUrl || images.products.defaultProductImage
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
    
    // Show confirmation modal
    setShowConfirmModal(true);
  };
  
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isEditMode && id) {
        // Update existing product
        const updatedProduct = await updateProduct(parseInt(id), formData);
        
        if (updatedProduct) {
          setSuccess('Product updated successfully');
          setTimeout(() => {
            navigate('/admin/products');
          }, 1500);
        } else {
          setError('Failed to update product');
        }
      } else {
        // Add new product
        const newProduct = await createProduct(formData);
        
        if (newProduct) {
          setSuccess('Product added successfully');
          setTimeout(() => {
            navigate('/admin/products');
          }, 1500);
        } else {
          setError('Failed to add product');
        }
      }
    } catch (err) {
      setError('An error occurred while saving the product');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/products')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Products
          </Button>
        </div>
        
        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}
        
        {loading && !isEditMode ? (
          <p>Loading...</p>
        ) : (
          <Card className="shadow-sm">
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a product name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Gadgets">Gadgets</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select a category.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a product description.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (₱)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid price.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        step="1"
                        min="0"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid stock quantity.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Featured Product"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                
                <ImageUploader
                  initialImage={formData.image}
                  onImageChange={handleImageChange}
                  label="Product Image"
                />
                
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="primary" type="submit" disabled={loading}>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    {isEditMode ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>
      
      {/* Form Submission Confirmation Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title={isEditMode ? "Confirm Update" : "Confirm Product Creation"}
        body={
          <>
            <div className="d-flex align-items-start mb-3">
              <img 
                src={formData.image} 
                alt={formData.name} 
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                className="me-3"
              />
              <div>
                <div className="fw-bold">{formData.name}</div>
                <div className="text-success">₱{formData.price.toFixed(2)}</div>
                <div className="small text-muted">{formData.category}</div>
              </div>
            </div>
            <p>
              Are you sure you want to {isEditMode ? "update" : "create"} this product?
            </p>
          </>
        }
        confirmText={isEditMode ? "Update Product" : "Create Product"}
        variant="success"
      />
    </>
  );
};

export default ProductForm; 