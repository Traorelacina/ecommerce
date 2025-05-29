import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Button, 
  message, 
  Upload, 
  Table, 
  Space, 
  Popconfirm,
  Divider,
  Card
} from 'antd';
import { 
  UploadOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import '../styles/AddProductPage.css';

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: File | string;
  rating?: number;
  stock: number;
  isNew?: boolean;
  isPromo?: boolean;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  rating?: number;
  stock: number;
  isNew?: boolean;
  isPromo?: boolean;
}

const AddProductPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await client.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      message.error('Erreur lors du chargement des produits');
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Vous ne pouvez uploader que des fichiers images!');
    }
    return isImage;
  };

  const handleUploadChange = (info: any) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
    
    if (info.file.status === 'done') {
      message.success(`${info.file.name} fichier uploadé avec succès`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} échec de l'upload.`);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      setProductsLoading(true);
      console.log('Tentative de suppression du produit ID:', productId); // Log l'ID
      
      const response = await client.delete(`/products/${productId}`);
      
      if (response.data.success) {
        message.success('Produit supprimé avec succès');
        await fetchProducts(); // Rafraîchir la liste
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression');
      }
    } catch (error: any) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
  
      let errorMessage = 'Erreur lors de la suppression';
      if (error.response?.status === 404) {
        errorMessage = 'Produit introuvable - peut-être déjà supprimé';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
  
      message.error(errorMessage);
    } finally {
      setProductsLoading(false);
    }
  };
  
  const onFinish = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price.toString());
      if (values.oldPrice) formData.append('oldPrice', values.oldPrice.toString());
      formData.append('category', values.category);
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }
      formData.append('stock', values.stock.toString());
      if (values.rating) formData.append('rating', values.rating.toString());
      formData.append('isNew', values.isNew?.toString() || 'false');
      formData.append('isPromo', values.isPromo?.toString() || 'false');

      const response = await client.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 201) {
        message.success('Produit ajouté avec succès');
        form.resetFields();
        setFileList([]);
        fetchProducts(); // Rafraîchir la liste après ajout
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'ajout du produit');
      }
    } catch (error: any) {
      let errorMessage = 'Erreur lors de l\'ajout du produit';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Le serveur ne répond pas. Vérifiez votre connexion.';
      }
      
      message.error(errorMessage);
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img 
          src={image?.startsWith('http') ? image : `https://ecommerce-backend-2-12tl.onrender.com${image}`} 
          alt="Produit" 
          style={{ width: 50, height: 50, objectFit: 'cover' }} 
        />
      ),
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Prix',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price} FCFA`,
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce produit?"
            onConfirm={() => handleDelete(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="add-product-page">
      <h1>Gestion des produits</h1>
      
      <Card title="Liste des produits existants" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          loading={productsLoading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>

      <Card title="Ajouter un nouveau produit">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="product-form"
        >
          <Form.Item 
            name="name" 
            label="Nom du produit" 
            rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
          >
            <Input placeholder="Nom du produit" />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true, message: 'Veuillez entrer une description' }]}
          >
            <Input.TextArea rows={4} placeholder="Description du produit" />
          </Form.Item>

          <Form.Item 
            name="price" 
            label="Prix" 
            rules={[{ required: true, message: 'Veuillez entrer le prix', type: 'number' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              style={{ width: '100%' }} 
              placeholder="Prix en FCFA" 
            />
          </Form.Item>

          <Form.Item name="oldPrice" label="Ancien prix (optionnel)">
            <InputNumber 
              min={0} 
              step={0.01} 
              style={{ width: '100%' }} 
              placeholder="Ancien prix en FCFA" 
            />
          </Form.Item>

          <Form.Item 
            name="category" 
            label="Catégorie" 
            rules={[{ required: true, message: 'Veuillez entrer la catégorie' }]}
          >
            <Input placeholder="Catégorie du produit" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image du produit"
            rules={[{ required: true, message: 'Veuillez sélectionner une image' }]}
          >
            <Upload
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              fileList={fileList}
              accept="image/*"
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Sélectionner l'image</Button>
            </Upload>
          </Form.Item>

          <Form.Item 
            name="rating" 
            label="Note (0-5)"
            initialValue={3}
          >
            <InputNumber 
              min={0} 
              max={5} 
              step={0.1} 
              style={{ width: '100%' }} 
            />
          </Form.Item>

          <Form.Item 
            name="stock" 
            label="Stock disponible" 
            rules={[{ required: true, message: 'Veuillez entrer le stock', type: 'number' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              placeholder="Quantité en stock" 
            />
          </Form.Item>

          <Form.Item 
            name="isNew" 
            label="Nouveau produit" 
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item 
            name="isPromo" 
            label="En promotion" 
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Ajouter le produit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProductPage;