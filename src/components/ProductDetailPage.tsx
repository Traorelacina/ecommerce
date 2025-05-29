import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Spin, 
  Image, 
  Typography, 
  Rate, 
  Button, 
  Tag, 
  Divider, 
  InputNumber, 
  Descriptions, 
  Tabs,
  Breadcrumb,
  message
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  ShareAltOutlined, 
  HomeOutlined,
  CheckCircleOutlined, 
  CloseCircleOutlined
} from '@ant-design/icons';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetailPage.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// Utilitaire pour les URLs d'images
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Utiliser l'URL complète du serveur backend
  return `https://ecommerce-backend-2-12tl.onrender.com${imagePath}`;
};

const ProductDetailPage = () => {
  // Récupérer l'ID du produit depuis l'URL
  const params = useParams();
  const productId = params.productId || params.id; // Essayer les deux formats possibles
  
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Débogage pour voir si le paramètre est correctement récupéré
  console.log("Params de l'URL:", params);
  console.log("ID du produit détecté:", productId);

  useEffect(() => {
    // Vérifier si productId est défini avant de faire l'appel API
    if (productId) {
      fetchProductDetails();
    } else {
      // Tenter de récupérer l'ID directement depuis le chemin de l'URL
      const pathParts = window.location.pathname.split('/');
      const possibleId = pathParts[pathParts.length - 1];
      
      console.log("Tentative de récupération d'ID depuis l'URL:", possibleId);
      
      if (possibleId && possibleId !== 'products') {
        // Utiliser cet ID si disponible
        fetchProductDetailsWithId(possibleId);
      } else {
        setError("Identifiant de produit manquant");
        setLoading(false);
      }
    }
  }, [productId]);

  const fetchProductDetailsWithId = async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      console.log(`Chargement du produit avec ID: ${id}`);
      
      const response = await client.get(`/products/${id}`);
      
      if (response.data && response.data.success) {
        setProduct(response.data.data);
        // Après avoir chargé le produit, chercher les produits connexes
        if (response.data.data && response.data.data.category) {
          fetchRelatedProducts(response.data.data.category);
        }
      } else {
        throw new Error(response.data?.message || 'Erreur lors du chargement du produit');
      }
    } catch (err) {
      console.error('Erreur lors du chargement du produit:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchProductDetails = () => {
    fetchProductDetailsWithId(productId);
  };

  const fetchRelatedProducts = async (category) => {
    if (!category) return;
    
    try {
      const response = await client.get(`/products?category=${encodeURIComponent(category)}&limit=4`);
      if (response.data && response.data.success) {
        // Filtrer pour exclure le produit actuel
        const filtered = response.data.data.filter(p => p._id !== productId);
        setRelatedProducts(filtered.slice(0, 4)); // Limiter à 4 produits
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits connexes:', err);
      // Ne pas définir d'erreur globale pour cette requête secondaire
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Adapter l'objet produit pour correspondre à l'interface Product du CartContext
      const cartProduct = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image
      };
      
      addToCart(cartProduct, quantity);
      message.success(`${quantity} ${product.name} ajouté(s) au panier`);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <Spin size="large" />
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Erreur</h2>
        <p>{error || "Ce produit n'existe pas ou a été supprimé."}</p>
        <Button type="primary" onClick={() => navigate('/products')}>
          Retour aux produits
        </Button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Fil d'Ariane */}
      <Breadcrumb className="product-breadcrumb">
        <Breadcrumb.Item>
          <a href="/"><HomeOutlined /> Accueil</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/products">Produits</a>
        </Breadcrumb.Item>
        {product.category && (
          <Breadcrumb.Item>
            <a href={`/products?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </a>
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[32, 24]} className="product-main-content">
        {/* Colonne gauche - Images */}
        <Col xs={24} md={12} className="product-images-column">
          <div className="product-main-image">
            <div className="product-badges">
              {product.isNew && <span className="badge new">Nouveau</span>}
              {product.isPromo && <span className="badge promo">Promo</span>}
            </div>
            <Image
              src={getImageUrl(product.image)}
              alt={product.name}
              className="main-product-image"
              fallback="/placeholder.png"
              preview={{
                mask: <div className="zoom-hint">Cliquez pour zoomer</div>
              }}
            />
          </div>
          
          {/* Images miniatures si le produit en a plusieurs */}
          {product.additionalImages && product.additionalImages.length > 0 && (
            <div className="product-thumbnails">
              {product.additionalImages.map((img, index) => (
                <Image 
                  key={index}
                  src={getImageUrl(img)}
                  alt={`${product.name} - vue ${index + 2}`}
                  className="thumbnail-image"
                  fallback="/placeholder.png"
                  preview={false}
                />
              ))}
            </div>
          )}
        </Col>

        {/* Colonne droite - Informations du produit */}
        <Col xs={24} md={12} className="product-info-column">
          <div className="product-header">
            <Title level={2}>{product.name}</Title>
            
            <div className="product-meta">
              <Rate disabled defaultValue={product.rating || 0} allowHalf />
              <Text className="review-count">({product.reviewCount || 0} avis)</Text>
              <Text className="product-reference">Réf: {(product._id && product._id.slice(-8)) || 'N/A'}</Text>
            </div>
            
            <div className="product-price-section">
              {product.oldPrice && (
                <Text delete className="old-price">{product.oldPrice.toFixed(2)} FCFA</Text>
              )}
              <Title level={3} className="current-price">{product.price.toFixed(2)} FCFA</Title>
              {product.oldPrice && (
                <Tag color="red" className="discount-tag">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </Tag>
              )}
            </div>
          </div>

          <Divider />
          
          <Paragraph className="product-short-description">
            {product.description}
          </Paragraph>
          
          <div className="product-availability">
            <Text strong>Disponibilité: </Text>
            {product.stock > 0 ? (
              <Text type="success">
                <CheckCircleOutlined /> En stock ({product.stock} disponibles)
              </Text>
            ) : (
              <Text type="danger">
                <CloseCircleOutlined /> Rupture de stock
              </Text>
            )}
          </div>
          
          {product.stock > 0 && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <Text>Quantité:</Text>
                <InputNumber 
                  min={1} 
                  max={product.stock} 
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  className="quantity-input"
                />
              </div>
              
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />} 
                size="large"
                className="add-to-cart-button"
                onClick={handleAddToCart}
              >
                Ajouter au panier
              </Button>
              
              <Button 
                icon={<HeartOutlined />}
                className="wishlist-button"
              >
                Favoris
              </Button>
            </div>
          )}

          <Divider />
          
          {/* Informations supplémentaires */}
          <div className="product-details">
            <Descriptions column={1} size="small" className="product-specs">
              {product.category && (
                <Descriptions.Item label="Catégorie">{product.category}</Descriptions.Item>
              )}
              {product.brand && (
                <Descriptions.Item label="Marque">{product.brand}</Descriptions.Item>
              )}
              {product.weight && (
                <Descriptions.Item label="Poids">{product.weight} kg</Descriptions.Item>
              )}
              {product.dimensions && (
                <Descriptions.Item label="Dimensions">{product.dimensions}</Descriptions.Item>
              )}
            </Descriptions>
          </div>
          
          <div className="product-share">
            <Button icon={<ShareAltOutlined />} type="text">
              Partager
            </Button>
          </div>
        </Col>
      </Row>

      {/* Onglets avec descriptions détaillées, spécifications, avis, etc. */}
      <div className="product-tabs-section">
        <Tabs defaultActiveKey="description" className="product-tabs">
          <TabPane tab="Description détaillée" key="description">
            <div className="tab-content">
              {product.longDescription ? (
                <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
              ) : (
                <Paragraph>{product.description}</Paragraph>
              )}
            </div>
          </TabPane>
          
          <TabPane tab="Spécifications" key="specifications">
            <div className="tab-content">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <Descriptions bordered column={1} className="specifications-table">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>
                  ))}
                </Descriptions>
              ) : (
                <Paragraph>Aucune spécification disponible pour ce produit.</Paragraph>
              )}
            </div>
          </TabPane>
          
          <TabPane tab={`Avis (${product.reviewCount || 0})`} key="reviews">
            <div className="tab-content">
              {/* Contenu des avis - à implémenter */}
              <Paragraph>Les avis clients seront bientôt disponibles.</Paragraph>
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* Produits connexes */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <Title level={3}>Produits similaires</Title>
          <Row gutter={[16, 16]}>
            {relatedProducts.map(relatedProduct => (
              <Col xs={24} sm={12} md={6} key={relatedProduct._id}>
                <div 
                  className="related-product-card"
                  onClick={() => {
                    // Forcer un rechargement complet de la page pour assurer la récupération des données
                    window.location.href = `/products/${relatedProduct._id}`;
                  }}
                >
                  <img 
                    src={getImageUrl(relatedProduct.image)} 
                    alt={relatedProduct.name} 
                    className="related-product-image"
                  />
                  <div className="related-product-info">
                    <Text strong className="related-product-name">{relatedProduct.name}</Text>
                    <Text className="related-product-price">{relatedProduct.price.toFixed(2)} FCFA</Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;