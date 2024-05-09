import React, { useState, useEffect } from 'react';
import { EnvironmentOutlined, LoadingOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Input, Button, Space, Typography, Menu } from 'antd';
import { SearchOutlined, HomeOutlined, StarOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometer, faWind, faTint } from '@fortawesome/free-solid-svg-icons';
import 'leaflet/dist/leaflet.css';
import './CSS/Home.css';
import WorldMap from '../Components/Maps';
import { Link } from 'react-router-dom';
import config from '../../../config';
const apiUrl = config.apiUrl;
const { Text, Title } = Typography;
const { Content, Sider } = Layout;

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState('');
  const [weatherImage, setWeatherImage] = useState(null);
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetchCurrentLocation();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isTyping) {
      fetchWeatherDataFromAPI(searchQuery);
    }
    // eslint-disable-next-line
  }, [searchQuery, isTyping]);

  useEffect(() => {
    if (map && mapCoordinates) {
      map.flyTo([mapCoordinates.lat, mapCoordinates.lng], 10);
    }
  }, [map, mapCoordinates]);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding to get location name from coordinates
            const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
            const reverseGeocodingResponse = await fetch(reverseGeocodingUrl);
            const reverseGeocodingData = await reverseGeocodingResponse.json();

            const city = reverseGeocodingData.address.city || reverseGeocodingData.address.village || 'Unknown City';
            setSearchQuery(`${latitude},${longitude}`);
            fetchWeatherDataFromAPI(latitude, longitude, city);
          } catch (error) {
            console.error('Error during reverse geocoding:', error);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };


  const fetchWeatherDataFromAPI = async (latitude, longitude, locationName) => {
    try {
      setLoading(true);
      const apiUrl = searchQuery
        ? `${apiUrl}/api/weather?city=${searchQuery}`
        : `${apiUrl}/api/weatherByCoordinates?latitude=${latitude}&longitude=${longitude}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data);
      setWeatherData(data);
      setWeatherImage(getWeatherImage(data.mainWeather));
      setSearchedLocation(searchQuery || locationName || `${data.name}, ${data.sys.country}`);
      // Check if latitude and longitude are available in the response
      if ('latitude' in data && 'longitude' in data) {
        // Set map coordinates here
        setMapCoordinates({ lat: data.latitude, lng: data.longitude });
      } else {
        console.error('Latitude or Longitude not found in the API response.');
      }
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
                <Title level={4}>
                  Air Conditions
                </Title>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space direction="horizontal" align="center">
                  <Text>{weatherData.description}</Text>
                  <Text>
                    {days[currentDate.getDay()]}, {currentDate.toLocaleDateString()}
                  </Text>
                </Space>
              </Col>

              <Col span={24} style={{ textAlign: 'center' }}>
                <Space direction="horizontal" align="center">
                  <FontAwesomeIcon icon={faThermometer} size="2x" />
                  <Title level={4} >
                    {(weatherData.temperature - 273.15).toFixed(2)}°C
                  </Title>
                  <Text>Temperature</Text>
                </Space>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space direction="horizontal" align="center">
                  <FontAwesomeIcon icon={faWind} size="2x" />
                  <Title level={4} >
                    {weatherData.windSpeed} km/h
                  </Title>
                  <Text>Wind Speed</Text>
                </Space>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space direction="horizontal" align="center">
                  <FontAwesomeIcon icon={faTint} size="2x" />
                  <Title level={4}>
                    {weatherData.humidity}%
                  </Title>
                  <Text>Humidity</Text>
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
        <Layout>
          <Content style={{ padding: '24px' }}>
            <div className="search-container">
              <Input
                placeholder="Search for Weather"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsTyping(true);
                }}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Search
              </Button>
            </div>
            {renderLocationSelector()}
            {renderWeatherData()}
            <div className='weather-image-container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
              {weatherImage && (
                <img src={`/Img/${weatherImage}`} alt="Weather" width={250} height={250} />
              )}
            </div>
            <Content
              style={{
                width: '650px',
                height: '350px',
                position: 'fixed',
                bottom: '20px',
                left: '35%',
                transform: 'translateX(-50%)',
                padding: '24px',
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
              }}
            >
              <WorldMap map={map} coordinates={mapCoordinates} />
            </Content>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Home;
