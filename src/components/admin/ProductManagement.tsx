import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faEye, 
  faPlus, 
  faSearch, 
  faCheck, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllProducts, 
  deleteProduct, 
  updateProduct 
} from '../../services/productService';
import { Product } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

const ProductManagement: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchProducts();
    }
  }, [isAuthenticated, isAdmin]);
  
  // If not admin, redirect to login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };
  
  const handleToggleFeatured = async (product: Product) => {
    try {
      const updatedProduct = await updateProduct(product.id, {
        featured: !product.featured
      });
      
      if (updatedProduct) {
        // Update the products list
        const updatedProducts = products.map(p => 
          p.id === product.id ? { ...p, featured: !p.featured } : p
        );
        
        setProducts(updatedProducts);
        setFilteredProducts(
          searchTerm.trim() === '' 
            ? updatedProducts 
            : updatedProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
        );
      }
    } catch (err) {
      setError('Failed to update product feature status.');
      console.error('Error updating product:', err);
    }
  };
  
  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };
  
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    
    try {
      const success = await deleteProduct(productToDelete.id);
      
      if (success) {
        // Remove the product from the state
        const updatedProducts = products.filter(p => p.id !== productToDelete.id);
        setProducts(updatedProducts);
        setFilteredProducts(
          searchTerm.trim() === '' 
            ? updatedProducts 
            : updatedProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
        );
        
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        setError('Failed to delete product. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while deleting the product.');
      console.error('Error deleting product:', err);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <Link to="/admin/products/new">
          <Button
            variant="primary"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Product
          </Button>
        </Link>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search products by name, category, or description..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>
      
      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length > 0 ? (
        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>#{product.id}</td>
                <td>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₱{product.price.toFixed(2)}</td>
                <td>
                  <span className={product.stock < 10 ? 'text-danger fw-bold' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <Button
                    variant={product.featured ? 'success' : 'outline-secondary'}
                    size="sm"
                    onClick={() => handleToggleFeatured(product)}
                  >
                    {product.featured ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} />
                    )}
                  </Button>
                </td>
                <td>
                  <Link to={`/admin/products/edit/${product.id}`}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-1" />
                      Edit
                    </Button>
                  </Link>

                  <Link to={`/products/${product.id}`}>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      View
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => confirmDelete(product)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">
          No products found {searchTerm ? 'matching your search criteria' : ''}.
        </Alert>
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProduct}
        title="Confirm Delete"
        body={
          <>
            Are you sure you want to delete the product "{productToDelete?.name}"? 
            This action cannot be undone.
          </>
        }
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        variant="danger"
      />
    </Container>
  );
};

export default ProductManagement; 