import React, { useState } from 'react';
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from './component/Home/Home';
import context from './context/context';
import { HashRouter, Routes, Route } from "react-router-dom"
import Dashboard from './component/Dashboard/Dashboard';
import SearchStock from './component/SearchStock/SearchStock';
import SingleStockInfo from './component/SingleStockInfo/SingleStockInfo';

function App() {
  
    const [login, setLogin] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [resSearch, setResSearch] = useState([]);
    const [clickedStock, setClickedStock] = useState([{symbol: 'IBM', name: 'International Business Machines', score: 11965000, price: 227.48, currency: 'USD', exchange : "NYQ", marketClose : 249, marketOpen : 238}]);
    const [loading, setLoading] = useState(false);
    const [forPredict, setForPredit] = useState([]);

  return (
      <context.Provider value={{login, setLogin, userInfo,setUserInfo, resSearch, setResSearch, clickedStock, setClickedStock, loading, setLoading, forPredict, setForPredit}} >
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/searchstock' element={<SearchStock />} />
          <Route path='/singlestock' element={<SingleStockInfo />} />
        </Routes>
      </HashRouter>
    </GoogleOAuthProvider>
      </context.Provider>
  );
}

export default App;
