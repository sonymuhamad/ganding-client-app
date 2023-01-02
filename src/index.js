import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import { MarketingDashboard, DeliveryNote, DetailSalesOrder, MarketingDetailDeliveryNote, SalesOrder, DetailCustomer, Customers, BaseMarketing, Invoice, DetailInvoice } from './components'


import { BasePurchasing, PurchasingDashboard, PurchaseOrder, Suppliers, DetailSupplier, DetailPurchaseOrder, DetailMaterial as MaterialDetail, Material, Login, Error, ProtectedLayout, DetailMaterialReceiptNote, ReceiptNote, DetailSubcontReceiptNote, PurchasingDetailDeliveryNoteSubcont } from './components';

import { PpicDashboard, BasePpic, Delivery, Materials, Production, Products, Warehouse, DetailDeliveryNoteMaterial, DetailDeliveryNoteSubcont, DetailProduction, DetailSubcontReceipt, PpicDetailDeliveryNote, PpicDetailMaterial, PpicProductDetail, NewMaterial, NewProduct, NewProduction, NewProductionPriority } from './components'

import { BasePlantManager, ManagerDashboard, Users, PurchaseReport, ProductionReport, SalesReport, DetailUser } from './components'


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
            <Route path='users/:userId' element={<DetailUser />} />
            <Route path='production-report' element={<ProductionReport />} />
            <Route path='sales-report' element={<SalesReport />} />
            <Route path='purchase-report' element={<PurchaseReport />} />

          </Route>

          <Route path='marketing' element={<BaseMarketing />}>

            <Route index element={<MarketingDashboard />} />

            <Route path='customers' element={<Customers />} />


            <Route path='customers/:customerId' element={<DetailCustomer />} />
            <Route path='delivery-note' element={<DeliveryNote />} />
            <Route path='delivery-note/:deliveryNoteId' element={<MarketingDetailDeliveryNote />} />

            <Route path='sales-order' element={<SalesOrder />} />
            <Route path='sales-order/:salesOrderId' element={<DetailSalesOrder />} />

            <Route path='invoice' element={<Invoice />} />
            <Route path='invoice/:invoiceId' element={<DetailInvoice />} />

          </Route>

          <Route path='ppic' element={<BasePpic />} >

            <Route index element={<PpicDashboard />} />
            <Route path='product' element={<Products />} />
            <Route path='product/:productId' element={<PpicProductDetail />} />
            <Route path='product/new' element={<NewProduct />} />
            <Route path='material' element={<Materials />} />
            <Route path='material/:materialId' element={<PpicDetailMaterial />} />
            <Route path='material/new' element={<NewMaterial />} />
            <Route path='warehouse' element={<Warehouse />} />

            <Route path='delivery' element={<Delivery />} />
            <Route path='delivery/:deliveryNoteId' element={<PpicDetailDeliveryNote />} />
            <Route path='delivery/subcont/:deliveryNoteSubcontId' element={<DetailDeliveryNoteSubcont />} />

            <Route path='production' element={<Production />} />
            <Route path='production/:productionId' element={<DetailProduction />} />
            <Route path='production/new' element={<NewProduction />} />
            <Route path='production/new/:priorityId' element={<NewProductionPriority />} />
            <Route path='warehouse/material-receipt/:deliveryNoteMaterialId' element={<DetailDeliveryNoteMaterial />} />
            <Route path='warehouse/subcont-receipt/:receiptNoteSubcontId' element={<DetailSubcontReceipt />} />
          </Route>

          <Route path='purchasing' element={<BasePurchasing />} >

            <Route index element={<PurchasingDashboard />} />
            <Route path='suppliers' element={<Suppliers />} />
            <Route path='suppliers/:supplierId' element={<DetailSupplier />} />
            <Route path='purchase-order/:purchaseOrderId' element={<DetailPurchaseOrder />} />
            <Route path='purchase-order' element={<PurchaseOrder />} />
            <Route path='material' element={<Material />} />
            <Route path='material/:materialId' element={<MaterialDetail />} />
            <Route path='shipments-and-receipts' element={<ReceiptNote />} />
            <Route path='shipments-and-receipts/material/:materialReceiptId' element={<DetailMaterialReceiptNote />} />
            <Route path='shipments-and-receipts/receipt-subcont/:receiptSubcontId' element={<DetailSubcontReceiptNote />} />
            <Route path='shipments-and-receipts/shipment-subcont/:deliverySubcontId' element={<PurchasingDetailDeliveryNoteSubcont />} />

          </Route>

        </Route>

      </Route>
      <Route path='*' element={<Error />} />

    </Routes>

  </BrowserRouter>
)
