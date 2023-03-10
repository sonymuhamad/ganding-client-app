import React, { useMemo, useCallback } from "react"
import { openModal } from "@mantine/modals"

import { ButtonDelete, ButtonEdit, ButtonAdd, HeadSection } from "../../../custom_components"
import { useRequest, useConfirmDelete, useNotification } from "../../../../hooks"
import { BaseTableExpanded } from "../../../tables"
import ModalAddMaterialReceived from './ModalAddMaterialReceived'
import ModalEditMaterialReceived from './ModalEditMaterialReceived'
import { ExpandedMaterialReceiptList } from "../../../layout"


const SectionMaterialReceived = (
    {
        setAddMaterialReceived,
        setUpdateMaterialReceived,
        setDeleteMaterialReceived,
        materialReceiptList,
        deliveryNoteMaterialId,
        supplierId,

    }
) => {

    const { Delete } = useRequest()
    const { successNotif, failedNotif } = useNotification()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Material received' })

    const openAddMaterialReceipt = useCallback(() => openModal({
        title: 'Add material receipt',
        radius: 'md',
        size: 'xl',
        children: <ModalAddMaterialReceived
            setAddMaterialReceived={setAddMaterialReceived}
            idDn={deliveryNoteMaterialId}
            idSupplier={supplierId} />

    }), [setAddMaterialReceived, deliveryNoteMaterialId, supplierId])


    const openEditMaterialReceipt = useCallback((data) => openModal({
        title: 'Edit quantity material arrival',
        size: 'xl',
        radius: 'md',
        children: <ModalEditMaterialReceived
            setUpdateMaterialReceived={setUpdateMaterialReceived}
            data={data}
            idDn={deliveryNoteMaterialId} />
    }), [deliveryNoteMaterialId, setUpdateMaterialReceived])


    const handleDeleteMaterialReceipt = useCallback(async (id) => {
        try {
            await Delete(id, 'receipts/materials-received')
            successNotif('Delete material received success')
            setDeleteMaterialReceived(id)
        } catch (e) {
            failedNotif(e, 'Delete material received failed')
        }
    }, [setDeleteMaterialReceived, successNotif, failedNotif])

    const columnMaterialReceived = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material_order.material.name
        },
        {
            name: 'Spec material',
            selector: row => row.material_order.material.spec
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditMaterialReceipt(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteMaterialReceipt(row.id))}
            />
        }

    ], [openEditMaterialReceipt, openConfirmDeleteData, handleDeleteMaterialReceipt])

    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddMaterialReceipt}
                >
                    Material received
                </ButtonAdd>
            </HeadSection>

            <BaseTableExpanded
                column={columnMaterialReceived}
                data={materialReceiptList}
                noData='Tidak ada data material yang diterima'
                expandComponent={ExpandedMaterialReceiptList}
            />
        </>
    )
}

export default SectionMaterialReceived