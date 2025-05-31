// ProductsSection.jsx 
import React, { useState, useEffect } from 'react';
import { Card, Tag, Spin, Pagination, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import '../styles/ProductsPage.css';
import { getProducts, Product } from '../services/productService';
import ProductCard from './ProductCard';

interface ProductsSectionProps {
  title: string;
  category?: string;
  limit?: number;
  showPagination?: boolean;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  title,
  category,
  limit = 8,
  showPagination = false
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://ecommerce-backend-2-12tl.onrender.com/${imagePath}`;
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
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        setProducts(filteredProducts.slice(startIndex, endIndex));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage, limit]);

  // Filtrer les produits en fonction de la recherche et de la catégorie
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Récupérer toutes les catégories uniques
  const categories = [...new Set(products.map(product => product.category))];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error-container">
        <p>Erreur: {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          {category && (
            <Button type="link" onClick={() => navigate(`/category/${category}`)}>
              Voir tout
            </Button>
          )}
        </div>

        <div className="products-header">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
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
          ))}
        </div>

        {showPagination && totalProducts > limit && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={limit}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;