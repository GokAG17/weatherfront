import React from 'react';

const LoadingScreen = () => {
  const loadingStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(35,31,32,255)',
    zIndex: 9999, 
  };

  const imgStyles = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover', 
  };

  return (
    <div style={loadingStyles} className="loading-screen">
      <img
        src="/Img/load1.gif" 
        alt="Loading"
        style={imgStyles}
      />
    </div>
  );
};

export default LoadingScreen;
