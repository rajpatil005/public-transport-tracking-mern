import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Spin, 
  Alert, 
  Button, 
  Space, 
  Tag, 
  Descriptions, 
  Row, 
  Col, 
  message,
  Statistic 
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CarOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';
import BusTracker from '../maps/BusTracker';
import { useSocket } from '../../context/SocketProvider';
import api from '../../services/api';

const { Title, Text } = Typography;

const TrackBus = () => {
  const { busId } = useParams(); // ✅ FIXED PARAM NAME
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, socket } = useSocket();

  useEffect(() => {
    fetchBusDetails();

    if (socket && busId) {
      socket.emit('track-bus', busId);

      socket.on('bus-location-update', (data) => {
        if (data.busId === busId) {
          setBus(prevBus => ({
            ...prevBus,
            currentLocation: data.location,
            speed: data.speed,
            heading: data.heading,
            lastUpdate: data.timestamp
          }));
        }
      });
    }

    const interval = setInterval(fetchBusDetails, 5000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('bus-location-update');
      }
    };
  }, [busId, socket]);

  const fetchBusDetails = async () => {
    try {
      const response = await api.get(`/vehicles/${busId}`);
      if (response.data.success) {
        setBus(response.data.data);
      }
    } catch (error) {
      console.log('Using demo data...');
      setBus(getDemoBusData(busId));
    } finally {
      setLoading(false);
    }
  };

  const getDemoBusData = (id) => {
    const demoServices = {
      '1': {
        _id: '1',
        busNumber: 'BUS-101',
        vehicleNumber: 'BUS-101',
        status: 'active',
        speed: 35,
        routeId: 'KPR-101',
        heading: 45,
        lastUpdate: new Date().toISOString(),
        currentLocation: { lat: 16.6950, lng: 74.2350 },
        driver: { name: 'Rajesh Kumar' }
      },
      '2': {
        _id: '2',
        busNumber: 'BUS-102',
        vehicleNumber: 'BUS-102',
        status: 'active',
        speed: 28,
        routeId: 'KPR-102',
        heading: 90,
        lastUpdate: new Date().toISOString(),
        currentLocation: { lat: 16.6930, lng: 74.2440 },
        driver: { name: 'Suresh Patil' }
      }
    };

    return demoServices[id] || demoServices['1'];
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Loading bus details..." />
      </div>
    );
  }

  if (!bus) {
    return (
      <Alert
        message="Bus Not Found"
        description={`No bus found with ID: ${busId}`}
        type="error"
        showIcon
      />
    );
  }

  const getDirection = (heading) => {
    if (!heading && heading !== 0) return '';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(heading / 45) % 8];
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <Space size="middle">
          <Link to="/home">
            <Button icon={<ArrowLeftOutlined />} size="large">
              Back
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>
            <CarOutlined style={{ color: '#1890ff', marginRight: 12 }} />
            Tracking {bus?.busNumber}
          </Title>
        </Space>

          <Tag color={isConnected ? 'success' : 'error'}>
            {isConnected ? '🔴 Live' : '⚫ Offline'}
          </Tag>
      </div>

      {/* Info Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Speed"
              value={bus?.speed || 0}
              suffix="km/h"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Status"
              value={bus?.status?.toUpperCase()}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Route"
              value={bus?.routeId}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Map */}
      <Card title="Live Bus Location">
        <div style={{ height: '500px' }}>
          <BusTracker bus={bus} />
        </div>
      </Card>

      {/* Details */}
      <Card title="Bus Details" style={{ marginTop: 24 }}>
        <Descriptions bordered column={3}>
          <Descriptions.Item label="Vehicle">
            {bus?.vehicleNumber}
          </Descriptions.Item>

          <Descriptions.Item label="Driver">
            {bus?.driver?.name || 'Not assigned'}
          </Descriptions.Item>

          <Descriptions.Item label="Heading">
            {bus?.heading}° {getDirection(bus?.heading)}
          </Descriptions.Item>

          <Descriptions.Item label="Last Update">
            {bus?.lastUpdate ? new Date(bus.lastUpdate).toLocaleString() : 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label="Location">
            {bus?.currentLocation
              ? `${bus.currentLocation.lat}, ${bus.currentLocation.lng}`
              : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Share */}
      <Card size="small" style={{ marginTop: 20 }}>
        <Space>
          <Text>Share link:</Text>
          <Tag
            color="blue"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              message.success('Link copied!');
            }}
          >
            {window.location.href}
          </Tag>
        </Space>
      </Card>
    </div>
  );
};

export default TrackBus;
