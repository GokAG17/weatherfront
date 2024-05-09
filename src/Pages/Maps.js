import React, { useState, useEffect } from 'react';
import { Layout, Menu, Modal, Spin, Typography } from 'antd';
import { EnvironmentOutlined, HomeOutlined, StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import WorldMap from '../Components/Maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faSun, faCloudSun, faCloudRain, faSnowflake, faSmog } from '@fortawesome/free-solid-svg-icons';
import { faMoon, faCloudMoon, faCloudShowersHeavy, faBolt, faQuestion, faTint, faEye, faWind, faMapMarkerAlt, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import './CSS/Maps.css';
import config from '../config';
const apiUrl = config.apiUrl;
const { Sider, Content } = Layout;
const { Text } = Typography;

const WeatherDashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ latitude: 0, longitude: 0 });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalVisible) {
      fetchWeatherData();
    }
    // eslint-disable-next-line
  }, [modalVisible]);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleMapClick = (location) => {
    setSelectedLocation(location);
    handleModalOpen();
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/api/weatherByCoordinates?latitude=${selectedLocation.latitude}&longitude=${selectedLocation.longitude}`
      );

      if (!response.ok) {
        throw Error('Network response was not ok');
      }

      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error('API Error:', error);
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d':
        return faSun;
      case '01n':
        return faMoon;
      case '02d':
        return faCloudSun;
      case '02n':
        return faCloudMoon;
      case '03d':
      case '03n':
        return faCloud;
      case '04d':
      case '04n':
        return faCloud;
      case '09d':
      case '09n':
        return faCloudRain;
      case '10d':
      case '10n':
        return faCloudShowersHeavy;
      case '11d':
      case '11n':
        return faBolt;
      case '13d':
      case '13n':
        return faSnowflake;
      case '50d':
      case '50n':
        return faSmog;
      default:
        return faQuestion;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden', background: '#fff' }}>
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
            <Link to="/">Home</Link>
            <span>Home</span>
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
            <Link to="/maps">Maps</Link>
            <span>Maps</span>
          </Menu.Item>
        </Menu>
      </Sider>

      <Content
        style={{
          marginLeft: '80px',
          padding: '24px',
          background: '#fff',
          borderRadius: '50px',
        }}
      >
        <div
          style={{ width: '1350px', height: '650px', overflow: 'hidden', position: 'relative' }}
        >
          <WorldMap onLocationClick={handleMapClick} />
        </div>
      </Content>

      <Modal
        title="Weather"
        visible={modalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        className="weather-modal"
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            {weatherData && (
              <>
                <div className="info-section">
                  <FontAwesomeIcon icon={faCloud} size="lg" />
                  <Text className="info-text">Description: {weatherData.description}</Text>
                </div>
                <div className="info-section">
                  <FontAwesomeIcon icon={faTemperatureHigh} size="lg" />
                  <Text className="info-text">Temperature: {(weatherData.temperature - 273.15).toFixed(2)}°C</Text>
                </div>
                <div className="info-section">
                  <FontAwesomeIcon icon={faTint} size="lg" />
                  <Text className="info-text">Humidity: {weatherData.humidity}%</Text>
                </div>
                <div className="info-section">
                  <FontAwesomeIcon icon={faWind} size="lg" />
                  <Text className="info-text">Wind Speed: {weatherData.windSpeed} km/h</Text>
                </div>
                <div className="info-section">
                  <FontAwesomeIcon icon={faEye} size="lg" />
                  <Text className="info-text">Visibility: {weatherData.visibility} meters</Text>
                </div>
                <div className="info-section">
                  <FontAwesomeIcon icon={faSun} size="lg" />
                  <Text className="info-text">Sunrise Time: {new Date(weatherData.sunriseTime * 1000).toLocaleTimeString()}</Text>
                </div>
                <div className="info-section moon">
                  <FontAwesomeIcon icon={faMoon} size="lg" />
                  <Text className="info-text">Sunset Time: {new Date(weatherData.sunsetTime * 1000).toLocaleTimeString()}</Text>
                </div>

                <div className="icon-section">
                  <FontAwesomeIcon icon={getWeatherIcon(weatherData.iconCode)} size="5x" />
                </div>
              </>
            )}
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default WeatherDashboard;
