import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Divider, 
  Space, 
  Alert,
  Spin,
  Select,
  Row,
  Col,
  message
} from 'antd';
import { 
  CreditCardOutlined, 
  UserOutlined, 
  HomeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';

const { Title, Text } = Typography;
const { Option } = Select;

const CheckoutForm = ({ totalAmount, onBack }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const savePaymentToHistory = (paymentData) => {
    const existingHistory = JSON.parse(localStorage.getItem('paymentSimulations')) || [];
    const updatedHistory = [paymentData, ...existingHistory];
    localStorage.setItem('paymentSimulations', JSON.stringify(updatedHistory));
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    try {
      // Simulation de délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulation de succès de paiement (80% de chance de succès)
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        const paymentData = {
          orderId: `SIM-${Date.now()}`,
          amount: totalAmount,
          paymentMethod: 'Carte de crédit (simulation)',
          date: new Date().toISOString()
        };

        // Sauvegarder dans l'historique
        savePaymentToHistory(paymentData);
        
        message.success('Paiement simulé réussi !');
        clearCart();
        
        navigate('/order-confirmation', { 
          state: paymentData
        });
      } else {
        throw new Error('Échec de paiement simulé (problème de fonds ou connexion)');
      }
    } catch (err) {
      setError(err.message);
      console.error('Payment simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="checkout-section">
        <Title level={4} className="section-title">
          <UserOutlined /> Informations personnelles
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Nom complet"
              rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
            >
              <Input placeholder="Jean Dupont" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Veuillez entrer votre email' },
                { type: 'email', message: 'Email invalide' }
              ]}
            >
              <Input placeholder="jean.dupont@example.com" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="checkout-section">
        <Title level={4} className="section-title">
          <HomeOutlined /> Adresse de livraison
        </Title>
        <Form.Item
          name="address"
          label="Adresse"
          rules={[{ required: true, message: 'Veuillez entrer votre adresse' }]}
        >
          <Input placeholder="123 Rue de la Paix" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="city"
              label="Ville"
              rules={[{ required: true, message: 'Veuillez entrer votre ville' }]}
            >
              <Input placeholder="Paris" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="postalCode"
              label="Code postal"
              rules={[{ required: true, message: 'Veuillez entrer votre code postal' }]}
            >
              <Input placeholder="75001" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="country"
              label="Pays"
              rules={[{ required: true, message: 'Veuillez sélectionner votre pays' }]}
              initialValue="FR"
            >
              <Select>
                <Option value="FR">France</Option>
                <Option value="BE">Belgique</Option>
                <Option value="CH">Suisse</Option>
                <Option value="LU">Luxembourg</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="checkout-section">
        <Title level={4} className="section-title">
          <CreditCardOutlined /> Paiement (simulation)
        </Title>
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            closable 
            style={{ marginBottom: 24 }}
          />
        )}

        <Card bordered={false} className="payment-card">
          <div className="card-simulation">
            <div className="card-number">•••• •••• •••• 4242</div>
            <div className="card-details">
              <span className="card-name">NOM SUR CARTE</span>
              <span className="card-expiry">••/••</span>
            </div>
          </div>
        </Card>

        <Text type="secondary" className="secure-payment-text">
          Simulation de paiement - aucune donnée n'est envoyée
        </Text>
      </div>

      <Divider />

      <Space size="large" className="checkout-actions">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={onBack}
          disabled={loading}
        >
          Retour
        </Button>
        <Button 
          type="primary" 
          htmlType="submit"
          loading={loading}
          icon={<CreditCardOutlined />}
          size="large"
        >
          Simuler le paiement (FCFA {totalAmount.toFixed(2)})
        </Button>
      </Space>
    </Form>
  );
};

const CheckoutPage = () => {
  const { calculateTotal } = useCart();
  const totalAmount = calculateTotal();
  const navigate = useNavigate();

  if (totalAmount <= 0) {
    return (
      <div className="empty-cart-container">
        <Card className="empty-cart-card">
          <Space direction="vertical" align="center" size="large">
            <Title level={3}>Votre panier est vide</Title>
            <Text type="secondary">Ajoutez des produits pour passer commande</Text>
            <Button 
              type="primary" 
              onClick={() => navigate('/products')}
            >
              Voir les produits
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <div className="checkout-header">
        <Title level={2}>Simulation de Paiement</Title>
        <Text type="secondary">Ceci est une simulation - aucune transaction réelle ne sera effectuée</Text>
      </div>

      <Divider />

      <CheckoutForm 
        totalAmount={totalAmount} 
        onBack={() => navigate(-1)} 
      />
    </div>
  );
};

export default CheckoutPage;