import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../services/productService';
import {
  Row,
  Col,
  Card,
  Button,
  InputNumber,
  Tabs,
  Rate,
  Tag,
  message,
  Spin,
  Descriptions,
  Image
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
        setSelectedImage(data.image);
      } catch (error) {
        console.error('Error fetching product:', error);
        message.error('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      message.success('Produit ajouté au panier');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600">Produit non trouvé</h2>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.isNew && (
                <Tag color="blue" className="absolute top-2 left-2">
                  Nouveau
                </Tag>
              )}
              {product.isPromo && (
                <Tag color="red" className="absolute top-2 right-2">
                  Promo
                </Tag>
              )}
            </div>
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <div
                  className={`cursor-pointer border-2 ${
                    selectedImage === product.image ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(product.image)}
                >
                  <img
                    src={product.image}
                    alt="Main"
                    className="w-full h-20 object-cover"
                  />
                </div>
                {product.additionalImages.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 ${
                      selectedImage === image ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Rate disabled defaultValue={product.rating} allowHalf />
                <span className="text-gray-500">
                  ({product.rating.toFixed(1)} - {product.reviewCount} avis)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {product.oldPrice && (
                <div className="text-gray-500 line-through">
                  {product.oldPrice.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'XOF'
                  })}
                </div>
              )}
              <div className="text-3xl font-bold text-blue-600">
                {product.price.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'XOF'
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Quantité</h3>
                <InputNumber
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={setQuantity}
                  className="w-32"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Ajouter au panier
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Acheter maintenant
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button icon={<HeartOutlined />}>Ajouter aux favoris</Button>
                <Button icon={<ShareAltOutlined />}>Partager</Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Disponibilité</h3>
              <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0
                  ? `En stock (${product.stock} unités)`
                  : 'Rupture de stock'}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <div className="mt-8">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="Description" key="description">
            <div className="prose max-w-none">
              <p>{product.longDescription || product.description}</p>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Spécifications" key="specifications">
            <Descriptions bordered>
              {product.specifications &&
                Object.entries(product.specifications).map(([key, value]) => (
                  <Descriptions.Item key={key} label={key}>
                    {value}
                  </Descriptions.Item>
                ))}
            </Descriptions>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Livraison" key="shipping">
            <Card>
              <h3 className="font-semibold mb-4">Options de livraison</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Livraison standard (3-5 jours ouvrables)</li>
                <li>Livraison express (1-2 jours ouvrables)</li>
                <li>Point relais disponible</li>
              </ul>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetailPage; 