import React, { useState, useEffect } from 'react';
import { EnvironmentOutlined, LoadingOutlined, MenuOutlined, SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Input, Button, Space, Typography, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometer, faWind, faTint } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import './CSS/Home.css';

const { Text, Title } = Typography;
const { Content, Sider, Header } = Layout;

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState('');
  const [weatherImage, setWeatherImage] = useState(null);
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    fetchCurrentLocation();
    // eslint-disable-next-line
  }, []);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataFromAPI(latitude, longitude);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  useEffect(() => {
    if (!isTyping) {
      fetchWeatherDataFromAPI(searchQuery);
    }
    // eslint-disable-next-line
  }, [searchQuery, isTyping]);

  const fetchWeatherDataFromAPI = async (latitude, longitude) => {
    try {
      setLoading(true);
      const apiUrl = searchQuery
        ? `http://localhost:8080/api/weather?city=${searchQuery}`
        : `http://localhost:8080/api/weatherByCoordinates?latitude=${latitude}&longitude=${longitude}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw Error('Network response was not ok');
      }

      const data = await response.json();
      setWeatherData(data);
      setWeatherImage(getWeatherImage(data.mainWeather));
      setSearchedLocation(searchQuery || `${data.name}, ${data.sys.country}`);
      setMapCoordinates({ lat: data.coord.lat, lng: data.coord.lon });
      setLoading(false);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const getWeatherImage = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'sunny.png';
      case 'rain':
        return 'raining.png';
      case 'clouds':
        return 'cloudy.png';
      case 'thunderstorm':
        return 'thunderstorm.png';
      case 'snow':
        return 'snow.png';
      case 'drizzle':
        return 'drizzle.png';
      case 'mist':
        return 'mist.png';
      case 'fog':
        return 'fog.png';
      default:
        return 'weather.png';
    }
  };

  const renderLocationSelector = () => {
    if (searchedLocation && weatherData) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDate = new Date();

      return (
        <div className="location-container">
          <div className="location-select">
            <Title level={4} style={{ color: '#FFFFFF' }}>
              <EnvironmentOutlined style={{ color: '#FFFFFF' }} />
              {searchedLocation}
            </Title>
            <Title level={3} style={{ color: '#FFFFFF' }}>
              {weatherData.description}
            </Title>
            <Title level={2} style={{ color: '#FFFFFF' }}>
              {(weatherData.temperature - 273.15).toFixed(2)}°C
            </Title>
            <Text style={{ color: '#FFFFFF' }}>
              {days[currentDate.getDay()]} | {currentDate.toLocaleDateString()}
            </Text>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderWeatherData = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();

    if (loading) {
      return (
        <div className="weather-container">
          <div className="weather-data">
            {renderLocationSelector()}
            <Row gutter={16} style={{ textAlign: 'center' }}>
              <Col span={24}>
                <Title level={5}>
                  <LoadingOutlined /> Loading...
                </Title>
              </Col>
            </Row>
          </div>
        </div>
      );
    } else if (weatherData) {
      return (
        <div className="weather-container">
          <div className="weather-data">
            <Row gutter={16} justify="center">
              <Col span={24} style={{ textAlign: 'center' }}>
                <Title level={4} style={{ color: '#FFFFFF' }}>
                  Air Conditions
                </Title>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space direction="horizontal" align="center">
                  <Text style={{ color: '#FFFFFF' }}>{weatherData.description}</Text>
                  <Text style={{ color: '#FFFFFF' }}>
                    {days[currentDate.getDay()]}, {currentDate.toLocaleDateString()}
                  </Text>
                </Space>
              </Col>

              <Col span={24} style={{ textAlign: 'center' }}>
                <Space direction="horizontal" align="center">
                  <FontAwesomeIcon icon={faThermometer} size="2x" color="#FFFFFF" />
                  <Title level={4} style={{ color: '#FFFFFF' }}>
                    {(weatherData.temperature - 273.15).toFixed(2)}°C
                  </Title>
                  <Text style={{ color: '#FFFFFF' }}>Temperature</Text>
                </Space>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space direction="horizontal" align="center">
                  <FontAwesomeIcon icon={faWind} size="2x" color="#FFFFFF" />
                  <Title level={4} style={{ color: '#FFFFFF' }}>
                    {weatherData.windSpeed} km/h
                  </Title>
                  <Text style={{ color: '#FFFFFF' }}>Wind Speed</Text>
                </Space>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space direction="horizontal" align="center">
                  <FontAwesomeIcon icon={faTint} size="2x" color="#FFFFFF" />
                  <Title level={4} style={{ color: '#FFFFFF' }}>
                    {weatherData.humidity}%
                  </Title>
                  <Text style={{ color: '#FFFFFF' }}>Humidity</Text>
                </Space>
              </Col>
            </Row>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const handleSearch = () => {
    setIsTyping(false);
    fetchWeatherDataFromAPI(searchQuery);
  };

  return (
    <div className="home">
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <Row gutter={18} justify="space-between" align="middle" className="header-content">
            <Col span={6}>
              <Button
                icon={<MenuOutlined style={{ color: '#FFFFFF' }} />}
                onClick={toggleSider}
                style={{ border: 'none', background: 'transparent' }}
              />
            </Col>
            <Col span={12} className="header-search">
              <Input
                placeholder="Search for Weather"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsTyping(true);
                }}
              />
            </Col>
            <Col span={6}>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Search
              </Button>
            </Col>
          </Row>
        </Header>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            width={80}
            collapsedWidth={0}
            theme="dark"
            className="sider"
            collapsed={collapsed}
            onCollapse={(collapsed) => setCollapsed(collapsed)}
          >
            <Menu mode="vertical" theme="dark" style={{ textAlign: 'center' }} className="menu">
              <Menu.Item key="/" icon={<HomeOutlined style={{ color: '#FFFFFF' }} />} className="menu-item">
                <Link to="/">Home</Link>
                <span className="menu-name">Home</span>
              </Menu.Item>
              <Menu.Item key="/maps" icon={<EnvironmentOutlined style={{ color: '#FFFFFF' }} />} className="menu-item">
                <Link to="/maps">Maps</Link>
                <span className="menu-name">Maps</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content>
              <div className="locationselect">{renderLocationSelector()}</div>
              <div className="w-container">{renderWeatherData()}</div>
              <div className='weather-image-container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                {weatherImage && (
                  <img src={`/Img/${weatherImage}`} alt="Weather" width={300} height={300} />
                )}
                {mapCoordinates && (
                  <MapContainer
                    center={mapCoordinates}
                    zoom={10}
                    style={{ width: '300px', height: '300px', marginTop: '10px' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={mapCoordinates}>
                      <Popup>{searchedLocation}</Popup>
                    </Marker>
                  </MapContainer>
                )}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default Home;
