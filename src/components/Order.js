import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../services/orderService';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Spin,
  message,
  Typography,
  Divider,
  Space
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Order = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      message.error('Erreur lors du chargement de la commande');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'processing',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      processing: 'En cours de traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600">Commande non trouvée</h2>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/orders')}
          className="mb-4"
        >
          Retour aux commandes
        </Button>

        <Title level={2} className="mb-8">
          Commande #{order._id.slice(-6).toUpperCase()}
        </Title>

        <Space direction="vertical" size="large" className="w-full">
          <Card title="Informations de la commande">
            <Descriptions bordered>
              <Descriptions.Item label="Date de commande">
                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </Descriptions.Item>
              <Descriptions.Item label="Statut">
                <Tag color={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                {order.total.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'XOF'
                })}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Articles commandés">
            <div className="space-y-4">
              {order.items.map((item) => (
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
                  {order.total.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'XOF'
                  })}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Informations de livraison">
            <Descriptions bordered>
              <Descriptions.Item label="Nom">
                {order.firstName} {order.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
              <Descriptions.Item label="Téléphone">{order.phone}</Descriptions.Item>
              <Descriptions.Item label="Adresse" span={3}>
                {order.address}
              </Descriptions.Item>
              <Descriptions.Item label="Ville">{order.city}</Descriptions.Item>
              <Descriptions.Item label="Code postal">
                {order.postalCode}
              </Descriptions.Item>
              <Descriptions.Item label="Pays">{order.country}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Méthode de paiement">
            <Descriptions bordered>
              <Descriptions.Item label="Méthode">
                {order.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Statut">
                <Tag color="success">Payé</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {order.notes && (
            <Card title="Notes">
              <p>{order.notes}</p>
            </Card>
          )}
        </Space>
      </div>
    </div>
  );
};

export default Order; 