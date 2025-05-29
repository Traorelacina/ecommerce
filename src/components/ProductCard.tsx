import React from 'react';
import { Card, Rate, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  stock: number;
  isNew?: boolean;
  isPromo?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  oldPrice,
  rating = 0,
  stock,
  isNew,
  isPromo
}) => {
  return (
    <Link to={`/products/${id}`}>
      <Card
        hoverable
        className="product-card"
        cover={
          <div className="relative">
            <img
              alt={name}
              src={image}
              className="w-full h-48 object-cover"
            />
            {isNew && (
              <Tag color="blue" className="absolute top-2 left-2">
                Nouveau
              </Tag>
            )}
            {isPromo && (
              <Tag color="red" className="absolute top-2 right-2">
                Promo
              </Tag>
            )}
          </div>
        }
        actions={[
          <div className="flex items-center justify-center">
            <ShoppingCartOutlined /> Voir détails
          </div>
        ]}
      >
        <div className="space-y-2">
          <h3 className="text-lg font-semibold truncate">{name}</h3>
          <div className="flex items-center space-x-2">
            <Rate disabled defaultValue={rating} allowHalf className="text-sm" />
            <span className="text-sm text-gray-500">
              ({rating.toFixed(1)})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                {oldPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
              </span>
            )}
            <span className="text-lg font-bold text-blue-600">
              {price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {stock > 0 ? `En stock (${stock})` : 'Rupture de stock'}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;