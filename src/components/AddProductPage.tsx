import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Switch,
  message,
  Card,
  Space
} from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { createProduct } from '../services/productService';

const { TextArea } = Input;
const { Option } = Select;

const AddProductPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        category: values.category,
        brand: values.brand,
        weight: values.weight,
        dimensions: values.dimensions,
        specifications: values.specifications.reduce((acc, spec) => {
          acc[spec.key] = spec.value;
          return acc;
        }, {}),
        longDescription: values.longDescription,
        isNew: values.isNew,
        isPromo: values.isPromo,
        oldPrice: values.isPromo ? values.oldPrice : undefined,
        rating: 0,
        reviewCount: 0
      };

      if (values.image?.[0]?.originFileObj) {
        productData.image = values.image[0].originFileObj;
      }

      if (values.additionalImages?.length > 0) {
        productData.additionalImages = values.additionalImages.map(
          (file) => file.originFileObj
        );
      }

      await createProduct(productData);
      message.success('Produit créé avec succès');
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      message.error('Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="py-8">
      <Card title="Ajouter un nouveau produit" className="max-w-4xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isNew: false,
            isPromo: false,
            specifications: [{ key: '', value: '' }]
          }}
        >
          <Form.Item
            name="name"
            label="Nom du produit"
            rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description courte"
            rules={[{ required: true, message: 'Veuillez entrer une description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="longDescription"
            label="Description détaillée"
          >
            <TextArea rows={6} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Prix"
            rules={[{ required: true, message: 'Veuillez entrer le prix' }]}
          >
            <InputNumber
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Veuillez entrer le stock' }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Catégorie"
            rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
          >
            <Select>
              <Option value="electronics">Électronique</Option>
              <Option value="clothing">Vêtements</Option>
              <Option value="home">Maison</Option>
              <Option value="beauty">Beauté</Option>
              <Option value="sports">Sports</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="brand"
            label="Marque"
            rules={[{ required: true, message: 'Veuillez entrer la marque' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Poids (kg)"
          >
            <InputNumber min={0} step={0.1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="dimensions"
            label="Dimensions (L x l x H en cm)"
          >
            <Input placeholder="30 x 20 x 10" />
          </Form.Item>

          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      rules={[{ required: true, message: 'Clé manquante' }]}
                    >
                      <Input placeholder="Clé" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true, message: 'Valeur manquante' }]}
                    >
                      <Input placeholder="Valeur" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Ajouter une spécification
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          <Form.Item
            name="image"
            label="Image principale"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Veuillez télécharger une image' }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="additionalImages"
            label="Images supplémentaires"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture"
              multiple
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="isNew"
            label="Nouveau produit"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="isPromo"
            label="Produit en promotion"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isPromo !== currentValues.isPromo
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('isPromo') ? (
                <Form.Item
                  name="oldPrice"
                  label="Ancien prix"
                  rules={[{ required: true, message: 'Veuillez entrer l\'ancien prix' }]}
                >
                  <InputNumber
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    className="w-full"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Créer le produit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProductPage; 