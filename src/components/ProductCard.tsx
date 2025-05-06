import React from 'react';
import { Card, Button, Tag, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  isNew?: boolean;
  isPromo?: boolean;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showActions = true }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    message.success(`${product.name} ajouté au panier !`);
  };

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Card
      hoverable
      className="product-card"
      cover={
        <div className="product-image-container">
          <img 
            alt={product.name} 
            src={product.image || '/placeholder-product.jpg'} 
            className="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
            }}
          />
          <div className="product-badges">
            {product.isNew && <Tag color="red">NOUVEAU</Tag>}
            {product.isPromo && product.oldPrice && (
              <Tag color="orange">-{discountPercentage}%</Tag>
            )}
          </div>
        </div>
      }
      actions={
        showActions ? [
          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />} 
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            Ajouter
          </Button>,
          <Link to={`/products/${product.id}`}>
            <Button icon={<EyeOutlined />} className="view-details-btn">
              Détails
            </Button>
          </Link>
        ] : undefined
      }
    >
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          {product.rating !== undefined && (
            <span className="rating">{'★'.repeat(Math.round(product.rating))}</span>
          )}
        </div>
        
        <div className="product-prices">
          {product.oldPrice && (
            <span className="old-price">€{product.oldPrice.toFixed(2)}</span>
          )}
          <span className="current-price">€{product.price.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;