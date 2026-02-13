import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { documentApi } from '@/services/document';
import { groupApi } from '@/services/group';
import type { Document, DocumentGroup } from '@/types';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [groups, setGroups] = useState<DocumentGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDocuments();
    fetchGroups();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentApi.getDocuments();
      setDocuments(response.list || []);
    } catch {
      message.error('获取文档列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await groupApi.getGroups();
      setGroups(response || []);
    } catch {
      message.error('获取分组列表失败');
    }
  };

  const handleAdd = () => {
    setEditingDocument(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Document) => {
    setEditingDocument(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: Document) => {
    setViewingDocument(record);
    setViewModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await documentApi.deleteDocument(id);
      message.success('删除成功');
      fetchDocuments();
    } catch {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingDocument) {
        await documentApi.updateDocument(editingDocument.id, values);
        message.success('更新成功');
      } else {
        await documentApi.createDocument(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchDocuments();
    } catch {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<Document> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '分组',
      dataIndex: 'groupId',
      key: 'groupId',
      render: (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        return group ? <Tag color="blue">{group.name}</Tag> : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个文档吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建文档
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={documents}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingDocument ? '编辑文档' : '新建文档'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入文档标题" />
          </Form.Item>
          <Form.Item
            name="groupId"
            label="分组"
            rules={[{ required: true, message: '请选择分组' }]}
          >
            <Select placeholder="请选择分组">
              {groups.map(group => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue="draft"
          >
            <Select>
              <Select.Option value="draft">草稿</Select.Option>
              <Select.Option value="published">已发布</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={10} placeholder="请输入文档内容" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="文档详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingDocument && (
          <div>
            <h2>{viewingDocument.title}</h2>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Tag color="blue">
                  {groups.find(g => g.id === viewingDocument.groupId)?.name || '未分组'}
                </Tag>
                <Tag color={viewingDocument.status === 'published' ? 'green' : 'orange'}>
                  {viewingDocument.status === 'published' ? '已发布' : '草稿'}
                </Tag>
              </Space>
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{viewingDocument.content}</div>
            <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
              创建时间: {new Date(viewingDocument.createdAt).toLocaleString('zh-CN')}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Documents;
