import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { getAllProducts, searchProducts } from '../../services/productService';
import { Product } from '../../types';
import ProductCard from '../common/ProductCard';
import { useLocation } from 'react-router-dom';

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 2000 });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));
        setCategories(uniqueCategories);
        
        // Check if there's a category query parameter
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
          setSelectedCategory(categoryParam);
          filterProducts(allProducts, categoryParam, priceRange);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const filterProducts = (
    productList: Product[], 
    category: string, 
    price: { min: number; max: number }
  ) => {
    let filtered = [...productList];
    
    // Filter by category if selected
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    // Filter by price range
    filtered = filtered.filter(p => p.price >= price.min && p.price <= price.max);
    
    setFilteredProducts(filtered);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      filterProducts(products, selectedCategory, priceRange);
      return;
    }
    
    try {
      const results = await searchProducts(searchQuery);
      
      // Apply filters to the search results
      filterProducts(results, selectedCategory, priceRange);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(products, category, priceRange);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedPriceRange = { ...priceRange, [name]: Number(value) };
    setPriceRange(updatedPriceRange);
    filterProducts(products, selectedCategory, updatedPriceRange);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Container>
      <h1 className="mb-4">Products</h1>
      
      {/* Search bar */}
      <Row className="mb-4">
        <Col>
          <InputGroup>
            <Form.Control
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </Button>
            <Button variant="secondary" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} />
              {showFilters ? ' Hide Filters' : ' Show Filters'}
            </Button>
          </InputGroup>
        </Col>
      </Row>
      
      {/* Filters */}
      {showFilters && (
        <Row className="mb-4">
          <Card body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Price: ₱{priceRange.min}</Form.Label>
                  <Form.Control
                    type="range"
                    name="min"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Price: ₱{priceRange.max}</Form.Label>
                  <Form.Control
                    type="range"
                    name="max"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
        </Row>
      )}
      
      {/* Products Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {loading ? (
          <Col>
            <p>Loading products...</p>
          </Col>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col>
            <p>No products found matching your criteria.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ProductCatalog; 