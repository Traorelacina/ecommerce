// ProductsSection.jsx 
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Spin, Empty, Rate, Pagination, Input } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import client from '../api/client';
import '../styles/ProductsPage.css';

const { Meta } = Card;
// Utilitaire pour les URLs d'images avec URL directe
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Utiliser l'URL complète du serveur backend
  return `https://ecommerce-backend-dcp4.onrender.com${imagePath}`;
};
const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const pageSize = 12;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await client.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des produits');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors du chargement des produits');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les produits en fonction de la recherche et de la catégorie
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Récupérer toutes les catégories uniques
  const categories = [...new Set(products.map(product => product.category))];

  // Pagination
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Affiche un message de chargement ou d'erreur si nécessaire
  if (loading) {
    return (
      <div className="products-loading-container">
        <Spin size="large" />
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error-container">
        <p>Erreur: {error}</p>
        <button onClick={fetchProducts}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Nos Produits</h1>
        
        <div className="products-filters">
          <Input
            placeholder="Rechercher un produit..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          
          <div className="category-filters">
            <span className="category-label">Catégories:</span>
            <Tag 
              color={selectedCategory === null ? "blue" : "default"}
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className="category-tag"
            >
              Toutes
            </Tag>
            {categories.map(category => (
              <Tag
                key={category}
                color={selectedCategory === category ? "blue" : "default"}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className="category-tag"
              >
                {category}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      {paginatedProducts.length === 0 ? (
        <Empty description="Aucun produit trouvé" />
      ) : (
        <>
          <Row gutter={[16, 24]}>
            {paginatedProducts.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                <Link to={`/products/${product._id}`}>
                  <Card
                    hoverable
                    className="product-card"
                    cover={
                      <div className="product-image-container">
                        <img 
                          alt={product.name}
                          src={getImageUrl(product.image)}
                          className="product-image"
                        />
                        {product.isNew && <div className="product-badge new">Nouveau</div>}
                        {product.isPromo && <div className="product-badge promo">Promo</div>}
                      </div>
                    }
                    actions={[
                      <div className="card-action">
                        <ShoppingCartOutlined /> Voir détails
                      </div>
                    ]}
                  >
                    <Meta
                      title={product.name}
                      description={
                        <div className="product-meta">
                          <div className="product-price">
                            {product.oldPrice && (
                              <span className="old-price">{product.oldPrice.toFixed(2)} FCFA</span>
                            )}
                            <span className="current-price">{product.price.toFixed(2)} FCFA</span>
                          </div>
                          <div className="product-rating">
                            <Rate disabled defaultValue={product.rating} allowHalf />
                            <span className="stock-info">
                              {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={filteredProducts.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsSection;