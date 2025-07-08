// Este arquivo será removido - duplicado e usa antd
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiService } from '../services/api';

const { Option } = Select;

interface Producer {
  id: string;
  document: string;
  document_type: 'CPF' | 'CNPJ';
  producer_name: string;
  email: string;
  phone: string;
}

const Producers: React.FC = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProducers();
  }, []);

  const loadProducers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getFarmers();
      setProducers(response.data || []);
    } catch (error) {
      message.error('Erro ao carregar produtores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingProducer) {
        await apiService.updateFarmer(editingProducer.id, values);
        message.success('Produtor atualizado com sucesso');
      } else {
        await apiService.createFarmer(values);
        message.success('Produtor criado com sucesso');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingProducer(null);
      loadProducers();
    } catch (error: any) {
      message.error(error.message || 'Erro ao salvar produtor');
    }
  };

  const handleEdit = (producer: Producer) => {
    setEditingProducer(producer);
    form.setFieldsValue(producer);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteFarmer(id);
      message.success('Produtor removido com sucesso');
      loadProducers();
    } catch (error: any) {
      message.error(error.message || 'Erro ao remover produtor');
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'producer_name',
      key: 'producer_name',
    },
    {
      title: 'Documento',
      dataIndex: 'document',
      key: 'document',
    },
    {
      title: 'Tipo',
      dataIndex: 'document_type',
      key: 'document_type',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Telefone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record: Producer) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja remover este produtor?"
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
        <h1>Produtores Rurais</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProducer(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Novo Produtor
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={producers}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingProducer ? 'Editar Produtor' : 'Novo Produtor'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingProducer(null);
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="producer_name"
            label="Nome do Produtor"
            rules={[{ required: true, message: 'Por favor, insira o nome do produtor' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="document_type"
            label="Tipo de Documento"
            rules={[{ required: true, message: 'Por favor, selecione o tipo de documento' }]}
          >
            <Select>
              <Option value="CPF">CPF</Option>
              <Option value="CNPJ">CNPJ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="document"
            label="Documento"
            rules={[{ required: true, message: 'Por favor, insira o documento' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira o email' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone"
            rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
          >
            <Input />
          </Form.Item>

          {!editingProducer && (
            <Form.Item
              name="password"
              label="Senha"
              rules={[{ required: true, message: 'Por favor, insira a senha' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Producers;
