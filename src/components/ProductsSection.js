import React, { useState, useEffect } from 'react';
import { Row, Col, Pagination, Spin, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from './ProductCard';

const ProductsSection = ({ category, title, showViewAll = true }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();

  const getImageUrl = (image) => {
    if (!image) return '/placeholder.png';
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    return '/placeholder.png';
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        let filteredProducts = data;
        
        if (category) {
          filteredProducts = data.filter(product => product.category === category);
        }
        
        setTotalProducts(filteredProducts.length);
        const startIndex = (currentPage - 1) * 8;
        const endIndex = startIndex + 8;
        setProducts(filteredProducts.slice(startIndex, endIndex));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showViewAll && (
          <Button type="link" onClick={() => navigate('/products')}>
            Voir tout
          </Button>
        )}
      </div>
      
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <ProductCard
              id={product._id}
              name={product.name}
              image={getImageUrl(product.image)}
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating}
              stock={product.stock}
              isNew={product.isNew}
              isPromo={product.isPromo}
            />
          </Col>
        ))}
      </Row>

      {totalProducts > 8 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={totalProducts}
            pageSize={8}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsSection; 