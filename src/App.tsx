import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Documents from './pages/Documents';
import Groups from './pages/Groups';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/documents" replace />} />
            <Route path="documents" element={<Documents />} />
            <Route path="groups" element={<Groups />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;

