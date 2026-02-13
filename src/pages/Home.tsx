import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, FolderOutlined, TeamOutlined } from '@ant-design/icons';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>欢迎使用宝藏文档管理系统</h1>
        <p>一个现代化的文档管理和协作平台</p>
      </div>
      
      <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="文档总数"
              value={0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="分组数量"
              value={0}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="团队成员"
              value={0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card title="快速开始" bordered={false}>
            <ul>
              <li>📝 创建您的第一个文档</li>
              <li>📁 组织文档分组结构</li>
              <li>👥 邀请团队成员协作</li>
              <li>🔍 使用搜索功能快速查找</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="功能特性" bordered={false}>
            <ul>
              <li>✨ 现代化的用户界面</li>
              <li>🚀 快速响应的性能</li>
              <li>📱 支持多种设备访问</li>
              <li>🔒 安全的权限管理</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
