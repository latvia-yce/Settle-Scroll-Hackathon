// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import CreateInvoice from './pages/CreateInvoice';
import SecureTransfer from './pages/SecureTransfer';
import SettlementSuccess from './pages/SettlementSuccess';
import Settings from './pages/Settings';

function App() {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/transfer" element={<SecureTransfer />} />
          <Route path="/success" element={<SettlementSuccess />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;