import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { groupApi } from '@/services/group';
import type { DocumentGroup } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<DocumentGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<DocumentGroup | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await groupApi.getGroups();
      setGroups(response || []);
    } catch {
      message.error('获取分组列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGroup(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: DocumentGroup) => {
    setEditingGroup(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await groupApi.deleteGroup(id);
      message.success('删除成功');
      fetchGroups();
    } catch {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingGroup) {
        await groupApi.updateGroup(editingGroup.id, values);
        message.success('更新成功');
      } else {
        await groupApi.createGroup(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchGroups();
    } catch {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<DocumentGroup> = [
    {
      title: '分组名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <FolderOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '父级分组',
      dataIndex: 'pId',
      key: 'pId',
      render: (pId: string) => {
        if (pId === 'root') return '根目录';
        const parent = groups.find(g => g.id === pId);
        return parent ? parent.name : '-';
      },
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个分组吗？"
            description="删除分组将会影响该分组下的所有文档"
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

  // Convert groups to tree data
  const buildTreeData = (groups: DocumentGroup[]): DataNode[] => {
    const map = new Map<string, DataNode>();
    const roots: DataNode[] = [];

    groups.forEach(group => {
      map.set(group.id, {
        key: group.id,
        title: group.name,
        icon: <FolderOutlined />,
        children: [],
      });
    });

    groups.forEach(group => {
      const node = map.get(group.id);
      if (node) {
        if (group.pId === 'root' || !map.has(group.pId)) {
          roots.push(node);
        } else {
          const parent = map.get(group.pId);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        }
      }
    });

    return roots;
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建分组
        </Button>
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <h3>分组树形结构</h3>
        <Tree
          showIcon
          defaultExpandAll
          treeData={buildTreeData(groups)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={groups}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingGroup ? '编辑分组' : '新建分组'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="分组名称"
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input placeholder="请输入分组名称" />
          </Form.Item>
          <Form.Item
            name="pId"
            label="父级分组ID"
            initialValue="root"
            rules={[{ required: true, message: '请输入父级分组ID' }]}
          >
            <Input placeholder="请输入父级分组ID，根目录为 root" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={4} placeholder="请输入分组描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Groups;
