// Este arquivo será removido - duplicado e usa antd
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiService } from '../services/api';

const { Option } = Select;

interface Property {
  id: string;
  farmer_id: string;
  farm_name: string;
  city: string;
  state: string;
  total_area_ha: number;
  arable_area_ha: number;
  vegetation_area_ha: number;
}

interface Farmer {
  id: string;
  producer_name: string;
}

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProperties();
    loadFarmers();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProperties();
      setProperties(response.data || []);
    } catch (error) {
      message.error('Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  const loadFarmers = async () => {
    try {
      const response = await apiService.getFarmers(1, 100);
      setFarmers(response.data || []);
    } catch (error) {
      message.error('Erro ao carregar produtores');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Validate area constraints
      if (values.arable_area_ha + values.vegetation_area_ha > values.total_area_ha) {
        message.error('A soma das áreas agricultável e de vegetação não pode ultrapassar a área total');
        return;
      }

      if (editingProperty) {
        await apiService.updateProperty(editingProperty.id, values);
        message.success('Propriedade atualizada com sucesso');
      } else {
        await apiService.createProperty(values);
        message.success('Propriedade criada com sucesso');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingProperty(null);
      loadProperties();
    } catch (error: any) {
      message.error(error.message || 'Erro ao salvar propriedade');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    form.setFieldsValue(property);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteProperty(id);
      message.success('Propriedade removida com sucesso');
      loadProperties();
    } catch (error: any) {
      message.error(error.message || 'Erro ao remover propriedade');
    }
  };

  const columns = [
    {
      title: 'Nome da Fazenda',
      dataIndex: 'farm_name',
      key: 'farm_name',
    },
    {
      title: 'Cidade',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Área Total (ha)',
      dataIndex: 'total_area_ha',
      key: 'total_area_ha',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: 'Área Agricultável (ha)',
      dataIndex: 'arable_area_ha',
      key: 'arable_area_ha',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: 'Área de Vegetação (ha)',
      dataIndex: 'vegetation_area_ha',
      key: 'vegetation_area_ha',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record: Property) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja remover esta propriedade?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger icon={<DeleteOutlined />}>
              Remover
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Propriedades Rurais</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProperty(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Nova Propriedade
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={properties}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingProperty ? 'Editar Propriedade' : 'Nova Propriedade'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingProperty(null);
        }}
        onOk={() => form.submit()}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="farmer_id"
            label="Produtor"
            rules={[{ required: true, message: 'Por favor, selecione o produtor' }]}
          >
            <Select showSearch placeholder="Selecione o produtor">
              {farmers.map(farmer => (
                <Option key={farmer.id} value={farmer.id}>
                  {farmer.producer_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="farm_name"
            label="Nome da Fazenda"
            rules={[{ required: true, message: 'Por favor, insira o nome da fazenda' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="city"
            label="Cidade"
            rules={[{ required: true, message: 'Por favor, insira a cidade' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="state"
            label="Estado"
            rules={[{ required: true, message: 'Por favor, insira o estado' }]}
          >
            <Input maxLength={2} />
          </Form.Item>

          <Form.Item
            name="total_area_ha"
            label="Área Total (hectares)"
            rules={[{ required: true, message: 'Por favor, insira a área total' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="arable_area_ha"
            label="Área Agricultável (hectares)"
            rules={[{ required: true, message: 'Por favor, insira a área agricultável' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="vegetation_area_ha"
            label="Área de Vegetação (hectares)"
            rules={[{ required: true, message: 'Por favor, insira a área de vegetação' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Properties;
