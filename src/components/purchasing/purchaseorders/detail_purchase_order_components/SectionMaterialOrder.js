import React, { useCallback, useMemo } from "react"

import { HeadSection, ButtonAdd, ButtonDelete, ButtonEdit } from "../../../custom_components"
import { useConfirmDelete, useRequest } from "../../../../hooks"
import { openModal } from "@mantine/modals"
import ModalAddMaterialOrder from "./ModalAddMaterialOrder"
import ModalEditMaterialOrder from "./ModalEditMaterialOrder"

import { BaseTableExpanded } from "../../../tables"
import { ExpandedMaterialOrderList } from "../../../layout"
import { SuccessNotif, FailedNotif } from "../../../notifications"



const SectionMaterialOrder = (
    { materialOrderList, setDeleteMaterialOrder, setAddMaterialOrder, setEditMaterialOrder, supplierId, purchaseOrderId }
) => {

    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Material order' })
    const { Delete } = useRequest()

    const openEditMaterialOrder = useCallback((data) => openModal({
        title: 'Edit material order',
        radius: 'md',
        size: 'xl',
        children: <ModalEditMaterialOrder data={data} setEditMaterialOrder={setEditMaterialOrder} />

    }), [setEditMaterialOrder])

    const openAddMaterialOrder = useCallback(() => openModal({
        title: 'Add material order',
        radius: 'md',
        size: 'xl',
        children: <ModalAddMaterialOrder idSupplier={supplierId} idPurchaseOrder={purchaseOrderId} setAddMaterialOrder={setAddMaterialOrder} />

    }), [supplierId, purchaseOrderId, setAddMaterialOrder])

    const handleDeleteMaterialOrder = useCallback(async (id) => {
        try {
            await Delete(id, 'material-order-management')
            SuccessNotif('Delete material order success')
            setDeleteMaterialOrder(id)
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [setDeleteMaterialOrder])

    const columnMaterialOrderList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material.name,
            sortable: true
        },
        {
            name: 'Order',
            selector: row => `${row.ordered} ${row.material.uom.name}`
        },
        {
            name: 'Arrived',
            selector: row => `${row.arrived} ${row.material.uom.name}`
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditMaterialOrder(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteMaterialOrder(row.id))}
            />
        }
    ], [handleDeleteMaterialOrder, openConfirmDeleteData, openEditMaterialOrder])


    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddMaterialOrder}
                >
                    Material order
                </ButtonAdd>
            </HeadSection>

            <BaseTableExpanded
                column={columnMaterialOrderList}
                data={materialOrderList}
                expandComponent={ExpandedMaterialOrderList}
                noData="This purchase order doesn't have any material order"
            />

        </>
    )

}

export default SectionMaterialOrder