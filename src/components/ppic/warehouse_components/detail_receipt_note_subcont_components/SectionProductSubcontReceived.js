import React, { useCallback, useMemo } from "react"
import { openModal } from "@mantine/modals"

import { BaseTableExpanded } from "../../../tables"
import ModalAddProductReceived from './ModalAddProductReceived'
import ModalEditProductReceived from './ModalEditProductReceived'
import { ExpandedProductSubcontReceived } from "../../../layout"
import { ButtonAdd, ButtonDelete, ButtonEdit, HeadSection } from "../../../custom_components"
import { useRequest, useConfirmDelete, useNotification } from "../../../../hooks"


const SectionProductSubcontReceived = (
    {
        setAddProductReceived,
        setUpdateProductReceived,
        setDeleteProductReceived,
        productReceived,
        receiptNoteSubcontId,

    }
) => {

    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Product subcont received' })
    const { Delete } = useRequest()
    const { successNotif, failedNotif } = useNotification()

    const handleDeleteProductReceived = useCallback(async (id) => {
        try {
            await Delete(id, 'receipts/products-received')
            setDeleteProductReceived(id)
            successNotif('Delete product received success')
        } catch (e) {
            failedNotif(e, 'Delete product received failed')
        }
    }, [setDeleteProductReceived, successNotif, failedNotif])

    const openEditProductReceived = useCallback((data) => openModal({
        title: 'Edit product received',
        radius: 'md',
        size: 'xl',
        children: <ModalEditProductReceived
            idReceiptNoteSubcont={receiptNoteSubcontId}
            data={data}
            setUpdateProductReceived={setUpdateProductReceived}
        />
    }), [setUpdateProductReceived, receiptNoteSubcontId])

    const openModalAddProductReceived = useCallback(() => openModal({
        title: 'Add product received',
        radius: 'md',
        size: 'xl',
        children: <ModalAddProductReceived
            idReceiptNoteSubcont={receiptNoteSubcontId}
            setAddProductReceived={setAddProductReceived}
        />
    }), [setAddProductReceived, receiptNoteSubcontId])

    const columnProductReceived = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_subcont.product.name
        },
        {
            name: 'Quantity received',
            selector: row => row.quantity
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditProductReceived(row)}
            />,

        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteProductReceived(row.id))}
            />,
        }
    ], [openEditProductReceived, openConfirmDeleteData, handleDeleteProductReceived])



    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openModalAddProductReceived}
                >
                    Product received
                </ButtonAdd>
            </HeadSection>

            <BaseTableExpanded
                noData="This receipt note doesn't have product received"
                column={columnProductReceived}
                data={productReceived}
                expandComponent={ExpandedProductSubcontReceived}
            />


        </>
    )
}

export default SectionProductSubcontReceived