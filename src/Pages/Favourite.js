import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Input, Space, Typography, Menu, Card, Modal, Button } from 'antd';
import { EnvironmentOutlined, HomeOutlined, StarOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './CSS/Favorite.css';
import config from '../../../config';
const apiUrl = config.apiUrl;
const { Title, Text } = Typography;
const { Sider, Content } = Layout;

const blueTheme = {
  backgroundColor: '#1890ff', 
  color: '#fff', 
};

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [newFavorite, setNewFavorite] = useState({ placeName: '', placeDescription: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${apiUrl}/favorites`);
      if (response.ok) {
        const favoritesData = await response.json();
        setFavorites(favoritesData);
      } else {
        console.error('Error fetching favorites:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleSaveFavorite = async () => {
    try {
      const requestBody = {
        placeName: newFavorite.placeName || 'DefaultName',
        placeDescription: newFavorite.placeDescription || 'DefaultDescription',
      };

      console.log('Request Body:', requestBody); // Add this line

      const response = await fetch(`${apiUrl}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response Status:', response.status); // Add this line

      if (response.ok) {
        fetchFavorites();
        setNewFavorite({ placeName: '', placeDescription: '' });
        setIsModalVisible(false);
      } else {
        console.error('Error saving favorite:', response.statusText);
        const responseBody = await response.text();
        console.log('Response body:', responseBody);
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };



  const handleFavoriteClick = async (favorite) => {
    try {
      const response = await fetch(`${apiUrl}/api/weather?city=${favorite.placeName}`);
      if (response.ok) {
        const weatherData = await response.json();
        setSearchedLocation(favorite.placeName);
        setWeatherData(weatherData);
      } else {
        console.error('Error fetching weather data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const response = await fetch(`${apiUrl}/favorites?id=${favoriteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFavorites();
        setSearchedLocation('');
        setWeatherData(null);
      } else {
        console.error('Error deleting favorite:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  const renderLocationSelector = () => {
    if (searchedLocation && weatherData) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDate = new Date();

      return (
        <div className="location-c">
          <div className="location-s">
            <Title level={4}>
              <EnvironmentOutlined />
              {searchedLocation}
            </Title>
            <Title level={3}>
              {weatherData.description}
            </Title>
            <Title level={2}>
              {(weatherData.temperature - 273.15).toFixed(2)}°C
            </Title>
            <Text>
              {days[currentDate.getDay()]} | {currentDate.toLocaleDateString()}
            </Text>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '24px', ...blueTheme }}>
      <Title level={2} style={{ color: '#fff' }}>Favorites</Title>
      <Sider
        width={50}
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '40px',
          overflow: 'hidden',
          borderRadius: '50px',
          border: '2px solid',
        }}
      >
        <Menu mode="vertical" style={{ height: '100%' }}>
          <Menu.Item
            key="/"
            icon={<HomeOutlined />}
            className="menu-item"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Link to="/" style={{ color: '#fff' }}>Home</Link>
            <span style={{ color: '#fff' }}>Home</span>
          </Menu.Item>
          <Menu.Item
            key="/fav"
            icon={<StarOutlined />}
            className="menu-item"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Link to="/fav" style={{ color: '#fff' }}>Favorite</Link>
          </Menu.Item>
          <Menu.Item
            key="/maps"
            icon={<EnvironmentOutlined />}
            className="menu-item"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Link to="/maps" style={{ color: '#fff' }}>Maps</Link>
            <span style={{ color: '#fff' }}>Maps</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Content>
        <Space direction="horizontal" style={{ textAlign: 'center', width: '100%' }}>
          <Card
            style={{ width: 300, cursor: 'pointer' }}
            onClick={() => setIsModalVisible(true)}
          >
            <PlusOutlined style={{ fontSize: 24 }} />
          </Card>
          {favorites.map((favorite) => (
            <Card
              key={favorite.id}
              title={favorite.placeName}
              style={{ width: 300, cursor: 'pointer' }}
              onClick={() => handleFavoriteClick(favorite)}
              extra={<DeleteOutlined onClick={() => handleDeleteFavorite(favorite.id)} />}
            >
              {favorite.placeDescription}
            </Card>
          ))}
          <Modal
            title="Add New Favorite"
            visible={isModalVisible}
            onOk={handleSaveFavorite}
            onCancel={() => setIsModalVisible(false)}
          >
            <Space direction="vertical">
              <Input
                name='placeName'
                placeholder="Name"
                value={newFavorite.placeName}
                onChange={(e) => setNewFavorite({ ...newFavorite, placeName: e.target.value })}
              />
              <Input
                placeholder="Description"
                name='placeDescription'
                value={newFavorite.placeDescription}
                onChange={(e) => setNewFavorite({ ...newFavorite, placeDescription: e.target.value })}
              />
            </Space>
          </Modal>
          <div >
            {renderLocationSelector()}
          </div>
        </Space>
      </Content>
    </div>
  );
};

export default Favorites;
