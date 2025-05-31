import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import {
  Table,
  Tag,
  Button,
  Card,
  Spin,
  message,
  Space,
  Typography
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Erreur lors du chargement des commandes');
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

  const columns = [
    {
      title: 'Numéro de commande',
      dataIndex: '_id',
      key: '_id',
      render: (id) => `#${id.slice(-6).toUpperCase()}`
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) =>
        total.toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'XOF'
        })
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orders/${record._id}`)}
        >
          Voir les détails
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto">
        <Title level={2} className="mb-8">
          Historique des commandes
        </Title>

        <Card>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total: ${total} commandes`
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default OrderHistory; 