import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Maps from './Pages/Maps';
import LoadingScreen from './Components/LoadingScreen';
import { SearchProvider } from './Components/Search';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const delay = 2000;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Router>
          <SearchProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/maps" element={<Maps />} />
            </Routes>
          </SearchProvider>
        </Router>
      )}

    </div>
  );
}

export default App;
