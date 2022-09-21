import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './components/Login'
import Error from './components/Error'
import ProtectedLayout from './components/ProtectedLayout'


import BaseMarketing from './components/marketing/BaseMarketing'
import MarketingDashboard from './components/marketing/MarketingDashboard'
import SalesOrder from './components/marketing/SalesOrder'
import Customers from './components/marketing/Customers'
import Customer from './components/marketing/Customer';
import DeliveryNote from './components/marketing/DeliveryNote'
import DeliverySchedule from './components/marketing/DeliverySchedule'

import BasePurchasing from './components/purchasing/BasePurchasing';
import PurchasingDashboard from './components/purchasing/PurchasingDashboard'
import PurchaseOrder from './components/purchasing/PurchaseOrder'
import Suppliers from './components/purchasing/Suppliers'


import BasePpic from './components/ppic/BasePpic';
import PpicDashboard from './components/ppic/PpicDashboard'
import Production from './components/ppic/Production'
import Products from './components/ppic/Products'
import Materials from './components/ppic/Materials'
import Delivery from './components/ppic/Delivery'
import Warehouse from './components/ppic/Warehouse'


import BasePlantManager from './components/plant-manager/BasePlantManager';
import Mrp from './components/plant-manager/report/Mrp'
import ReportSalesOrder from './components/plant-manager/report/ReportSalesOrder'
import MaterialReceipt from './components/plant-manager/report/MaterialReceipt'
import ManagerDashboard from './components/plant-manager/ManagerDashboard'
import Users from './components/plant-manager/Users'

import { createTheme } from 'react-data-table-component';


createTheme(
  'blues',
  {
    text: {
      primary: '#f1f3f5',
      secondary: '#f1f3f5',
    },
    background: {
      default: '#e7f5ff',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    button: {
      default: '#2aa198',
      hover: 'rgba(0,0,0,.08)',
      focus: 'rgba(255,255,255,.12)',
      disabled: 'rgba(255, 255, 255, .34)',
    },
    sortFocus: {
      default: '#2aa198',
    },
  },
  'dark',
);


createTheme(
  'orange',
  {
    text: {
      primary: '#f1f3f5',
      secondary: '#f1f3f5',
    },
    background: {
      default: '#fff4e6',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    button: {
      default: '#2aa198',
      hover: 'rgba(0,0,0,.08)',
      focus: 'rgba(255,255,255,.12)',
      disabled: 'rgba(255, 255, 255, .34)',
    },
    sortFocus: {
      default: '#2aa198',
    },
  },
  'dark',
);


createTheme(
  'green',
  {
    text: {
      primary: '#f1f3f5',
      secondary: '#f1f3f5',
    },
    background: {
      default: '#ebfbee',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    button: {
      default: '#2aa198',
      hover: 'rgba(0,0,0,.08)',
      focus: 'rgba(255,255,255,.12)',
      disabled: 'rgba(255, 255, 255, .34)',
    },
    sortFocus: {
      default: '#2aa198',
    },
  },
  'dark',
);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>

    <Routes>

      <Route path='/' element={<App />} >
        <Route index element={<Login />} />
        <Route path='login/*' element={<Login />} />

        <Route path='/home' element={<ProtectedLayout />} >

          <Route path='plant-manager' element={<BasePlantManager />}>

            <Route index element={<ManagerDashboard />} />
            <Route path='users' element={<Users />} />
            <Route path='report-material-receipt' element={<MaterialReceipt />} />
            <Route path='report-sales-order' element={<ReportSalesOrder />} />
            <Route path='report-mrp' element={<Mrp />} />

          </Route>

          <Route path='marketing' element={<BaseMarketing />}>

            <Route index element={<MarketingDashboard />} />
            <Route path='customers' element={<Customers />} >
            </Route>
            <Route path='customers/:customerId' element={<Customer />} />
            <Route path='sales-order' element={<SalesOrder />} />
            <Route path='delivery-note' element={<DeliveryNote />} />
            <Route path='delivery-schedule' element={<DeliverySchedule />} />

          </Route>

          <Route path='ppic' element={<BasePpic />} >

            <Route index element={<PpicDashboard />} />
            <Route path='product' element={<Products />} />
            <Route path='material' element={<Materials />} />
            <Route path='warehouse' element={<Warehouse />} />
            <Route path='delivery' element={<Delivery />} />
            <Route path='production' element={<Production />} />

          </Route>

          <Route path='purchasing' element={<BasePurchasing />} >

            <Route index element={<PurchasingDashboard />} />
            <Route path='suppliers' element={<Suppliers />} />
            <Route path='purchase-order' element={<PurchaseOrder />} />
            <Route path='material-receipt-schedule' element={<MaterialReceipt />} />

          </Route>

        </Route>

      </Route>
      <Route path='*' element={<Error />} />

    </Routes>

  </BrowserRouter>
)
