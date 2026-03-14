import './App.css';
import { useEffect } from 'react';
import { BrowserRouter ,Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transaction from './pages/Transaction';
import Categories from './pages/Category';
import  useUserAuth from './auth/useUserAuth';
import { Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Layout from "./components/Layout";
import { useState } from 'react';
import AIChatWidget from './components/AIChatWidget';
import api from './api/api';

function App() {
  const { loading, authenticated } = useUserAuth();
  const [aicontext,setAIContext]=useState(null);
  const [refreshAi,setRefreshAi]=useState(0);
  
  useEffect(() => {
    const fetchAIContext = async () => {
        try {
          const [
            patternsRes,
            anomaliesRes,
            forecastRes,
            budgetRes
          ] = await Promise.all([
            api.get("/ai/spending-patterns"),
            api.get("/ai/anomalies"),
            api.get("/ai/forecast"),
            api.get("/ai/budget")
          ]);
          
          setAIContext({
            patterns: patternsRes.data.patterns,
            anomalies: anomaliesRes.data.anomalies,
            forecast: forecastRes.data.forecast,
            budgets: budgetRes.data.budgets
          });
        } catch (err) {
          console.error("AI context fetch failed", err);
        }
      };
      
      fetchAIContext();
    }, [refreshAi,authenticated]);

    const triggerAIRefresh = () => {
      setRefreshAi(prev=>prev+1);
    };

    
    if (loading) return <p>Checking session...</p>;
    
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={authenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path='/dashboard' element={authenticated ? <Layout><Dashboard onTransactionReferesh={triggerAIRefresh}/></Layout> : <Navigate to="/" />} />
          <Route path='/transaction' element={authenticated ? <Layout><Transaction onTransactionReferesh={triggerAIRefresh} /></Layout> : <Navigate to="/" />} />
          <Route path='/categories' element={authenticated ? <Layout><Categories/></Layout> : <Navigate to="/" />} />
        </Routes>
        {authenticated && <AIChatWidget
        contextData={aicontext}
        ></AIChatWidget>}
      </BrowserRouter>
  );
}

export default App;
