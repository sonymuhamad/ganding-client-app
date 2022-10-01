import React from 'react';
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
import DetailProduct from './components/marketing/DetailProduct';
import NewSalesOrder from './components/marketing/NewSalesOrder';
import DetailSalesOrder from './components/marketing/DetailSalesOrder';
import DetailDeliveryNote from './components/marketing/DetailDeliveryNote';


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

            <Route path='customers' element={<Customers />} />


            <Route path='customers/:customerId' element={<Customer />} />
            <Route path='customers/:customerId/:productId' element={<DetailProduct />} />
            <Route path='delivery-note' element={<DeliveryNote />} />
            <Route path='delivery-note/:deliverynoteId' element={<DetailDeliveryNote />} />

            <Route path='sales-order' element={<SalesOrder />} />
            <Route path='sales-order/:salesOrderId' element={<DetailSalesOrder />} />
            <Route path='sales-order/new' element={<NewSalesOrder />} />

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
