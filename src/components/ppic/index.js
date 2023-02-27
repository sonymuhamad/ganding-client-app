import BasePpic from './BasePpic'
import Delivery from './Delivery'
import Materials from './Materials'
import PpicDashboard from './PpicDashboard'
import Production from './Production'
import Products from './Products'
import Warehouse from './Warehouse'
import { DetailDeliveryNote as PpicDetailDeliveryNote, DetailDeliveryNoteSubcont } from './delivery_components'
import { DetailDeliveryNoteMaterial, DetailSubcontReceipt } from './warehouse_components'
import { DetailMaterial as PpicDetailMaterial, NewMaterial } from './material_components'
import { DetailProduct as PpicProductDetail, NewProduct } from './product_components'
import { NewProduction, NewProductionPriority, DetailProduction } from './production_components'

export {
    BasePpic, Delivery, Materials, PpicDashboard, Production, Products, Warehouse,
    PpicDetailDeliveryNote, DetailDeliveryNoteMaterial, DetailDeliveryNoteSubcont, DetailProduction, DetailSubcontReceipt, PpicDetailMaterial, NewMaterial, PpicProductDetail, NewProduct, NewProduction, NewProductionPriority
}
