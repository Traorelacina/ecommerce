import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Divider,
  Space,
  Select
} from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const { Option } = Select;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const orderData = {
        ...values,
        items: cart,
        total,
        status: 'pending'
      };

      await createOrder(orderData);
      message.success('Commande passée avec succès');
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
      message.error('Erreur lors de la création de la commande');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          onClick={() => navigate('/products')}
        >
          Continuer vos achats
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card title="Informations personnelles" className="mb-4">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
              >
                <Form.Item
                  name="firstName"
                  label="Prénom"
                  rules={[{ required: true, message: 'Veuillez entrer votre prénom' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label="Nom"
                  rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Veuillez entrer votre email' },
                    { type: 'email', message: 'Email invalide' }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Téléphone"
                  rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
                >
                  <Input />
                </Form.Item>

                <Divider>Adresse de livraison</Divider>

                <Form.Item
                  name="address"
                  label="Adresse"
                  rules={[{ required: true, message: 'Veuillez entrer votre adresse' }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                  name="city"
                  label="Ville"
                  rules={[{ required: true, message: 'Veuillez entrer votre ville' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="postalCode"
                  label="Code postal"
                  rules={[{ required: true, message: 'Veuillez entrer votre code postal' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="country"
                  label="Pays"
                  rules={[{ required: true, message: 'Veuillez sélectionner votre pays' }]}
                >
                  <Select>
                    <Option value="senegal">Sénégal</Option>
                    <Option value="cote-divoire">Côte d'Ivoire</Option>
                    <Option value="mali">Mali</Option>
                    <Option value="burkina-faso">Burkina Faso</Option>
                    <Option value="togo">Togo</Option>
                  </Select>
                </Form.Item>

                <Divider>Méthode de paiement</Divider>

                <Form.Item
                  name="paymentMethod"
                  label="Méthode de paiement"
                  rules={[{ required: true, message: 'Veuillez sélectionner une méthode de paiement' }]}
                >
                  <Select>
                    <Option value="wave">Wave</Option>
                    <Option value="orange-money">Orange Money</Option>
                    <Option value="mtn-momo">MTN Mobile Money</Option>
                    <Option value="cash">Paiement à la livraison</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="notes"
                  label="Notes (optionnel)"
                >
                  <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    Passer la commande
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>

          <div>
            <Card title="Récapitulatif de la commande">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(item.price * item.quantity).toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'XOF'
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                <Divider />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {total.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'XOF'
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 